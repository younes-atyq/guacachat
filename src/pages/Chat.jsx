import { useContext, useEffect, useRef, useState } from "react";
import Nav from "../components/Nav";
import { EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import useAuthRedirect from "../hooks/useAuthRedirect";
import SendMsgUI from "../helpers/SendMsgUI";
import { signOut } from "firebase/auth";
import { auth, queryCurrentRoom } from "../firebase";
import { onSnapshot } from "firebase/firestore";
import { RoomContext } from "../App";
import PreventRefresh from "../components/PreventRefresh";

const Chat = (props) => {
  useAuthRedirect();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [messages, setMessages] = useState([]);
  const chat = useRef();
  const sidebar = useRef();
  const currentRoom = useContext(RoomContext);

  if (currentRoom?.room)
    sessionStorage.setItem("currentRoom", currentRoom.room);

  // scroll the chat to the bottom
  useEffect(() => {
    chat.current?.scrollTo(0, chat.current?.scrollHeight);
  }, [messages, props]);

  const handleClick = () => {
    if (!chat?.current || !editorState.getCurrentContent()) return;
    SendMsgUI({
      chat: chat.current,
      editorState,
      setEditorState,
      EditorState,
      currentRoom: currentRoom.room,
    });
  };

  // get the messages from the database
  useEffect(() => {
    // the only way I found to get the current room
    // because the path is not related to the chat
    let room = currentRoom?.room
      ? currentRoom?.room
      : sessionStorage.getItem("currentRoom");

    const unsubscribe = onSnapshot(queryCurrentRoom(room), (snapshot) => {
      let messages = [];
      snapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      setMessages(messages);
    });
    return () => unsubscribe();
  }, [currentRoom.room]);

  // // "ctrl + enter" method has an issue
  // useEffect(() => {
  //   const unsubscribe = document.addEventListener("keydown", (e) => {
  //     if (e.ctrlKey && e.key === "Enter") {
  //       e.preventDefault();
  //       document.querySelector("button").click();
  //     }
  //   });
  //   return () => unsubscribe;
  // }, []);

  return (
    <div id="chat" className="container">
      <PreventRefresh />
      <Nav pageName="rooms" />
      <div ref={chat} id="messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className="message"
            dangerouslySetInnerHTML={{ __html: message.message }}
          ></div>
        ))}
      </div>
      {/* display button to open the sidebar */}
      <button
        onClick={(e) => {
          sidebar.current?.classList.toggle("active");
          e.target?.classList.toggle("active");
        }}
        id="menu-btn"
      >
        &rarr;
      </button>

      <aside ref={sidebar} id="room">
        <h2 id="room-name">{currentRoom.room}</h2>
        <button id="logout" onClick={() => signOut(auth)}>
          Logout
        </button>
      </aside>

      <div id="input-field">
        <Editor
          editorState={editorState}
          onEditorStateChange={setEditorState}
          wrapperClassName="editor-wrapper"
          editorClassName="editor"
          toolbarClassName="toolbar"
          toolbar={{
            options: ["inline", "blockType", "list"],
            inline: {
              inDropdown: false,
              options: ["bold", "italic", "underline"],
            },
            blockType: {
              inDropdown: true,
              options: ["H1", "H2", "unordered-list-item", "ordered-list-item"],
            },
          }}
        />
        <div>
          <button onClick={handleClick} title="Ctrl + Enter" id="send">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
