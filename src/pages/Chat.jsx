import { useContext, useEffect, useRef, useState } from "react";
import Nav from "../components/Nav";
import { EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import useAuthRedirect from "../hooks/useAuthRedirect";
import SendMsgUI from "../helpers/sendMsgUI";
import { signOut } from "firebase/auth";
import { auth, db, queryCurrentRoom } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { RoomContext } from "../App";
import setUserOnline from "../helpers/setUserOnline";

const Chat = (props) => {
  useAuthRedirect();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [messages, setMessages] = useState([]);
  const chat = useRef();
  const sidebar = useRef();
  const currentRoom = useContext(RoomContext);
  const [onlineUsers, setOnlineUsers] = useState([]);
  // const

  // Persist current room in sessionStorage to maintain state through page reload
  if (currentRoom?.room)
    sessionStorage.setItem("currentRoom", currentRoom.room);

  // scroll the chat to the bottom
  useEffect(() => {
    chat.current?.scrollTo(0, chat.current?.scrollHeight);
  }, [messages, props]);

  // Send the message
  const handleClick = () => {
    if (!chat?.current || !editorState.getCurrentContent().hasText()) return;
    SendMsgUI({
      editorState,
      setEditorState,
      EditorState,
      currentRoom: currentRoom?.room
        ? currentRoom?.room
        : sessionStorage.getItem("currentRoom"),
    });
  };

  // Get the messages from the database
  useEffect(() => {
    // The only way I found to get the current room because the URL path is not related to the chat
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

  // Mange user states
  useEffect(() => {
    const roomRef = collection(
      db,
      "rooms",
      currentRoom?.room
        ? currentRoom?.room
        : sessionStorage.getItem("currentRoom"),
      "onlineUsers"
    );
    const unsubscribe = onSnapshot(roomRef, (users) => {
      const onlineUsers = [];
      users.forEach((user) => {
        onlineUsers.push({
          username: user.data().username,
          userId: user.data().userId,
        });
      });
      setOnlineUsers(onlineUsers);
    });
    return () => unsubscribe();
  }, [currentRoom?.room]);

  setUserOnline({
    currentRoom: currentRoom?.room
      ? currentRoom?.room
      : sessionStorage.getItem("currentRoom"),
  });

  return (
    <div id="chat" className="container">
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
      <button
        onClick={(e) => {
          sidebar.current?.classList.toggle("active");
          e.target?.classList.toggle("active");
        }}
        id="menu-btn"
      >
        &rarr;
      </button>

      <aside ref={sidebar} id="room-info">
        <h2 id="room-name">
          {currentRoom.room
            ? currentRoom.room
            : sessionStorage.getItem("currentRoom")}
        </h2>
        <div id="online-users">
          <h3>Online users:</h3>
          <ul>
            {onlineUsers.map((user, i) => {
              console.log(user);
              return <li key={i}>{user.username}</li>;
            })}
          </ul>
        </div>
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
            SEND
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
