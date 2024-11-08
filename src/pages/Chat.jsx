import { useContext, useEffect, useRef, useState } from "react";
import Nav from "../components/Nav";
import { EditorState, getDefaultKeyBinding } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import useAuthRedirect from "../hooks/useAuthRedirect";
import sendMsgUI from "../helpers/SendMsgUI";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { RoomContext } from "../App";
import setUserOnline from "../helpers/setUserOnline";
import { Link, useNavigate } from "react-router-dom";
import setUserStates from "../helpers/setUserStates";
import Popup from "../components/Popup";
import GetMessages from "../components/GetMessages";
import { stateFromHTML } from "draft-js-import-html";
import { convertToHTML } from "draft-convert";
import deleteRoomFunc from "../helpers/DeleteRoom";
import getMessagesFunc from "../helpers/GetMessages";
import manageUserSatesFunc from "../helpers/ManageUserStatesFunc";
import setUserOffline from "../helpers/setUserOffline";

const Chat = (props) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [messages, setMessages] = useState([]);
  const sending = useRef(true);
  const chat = useRef();
  const sidebar = useRef();
  const currentRoom = useContext(RoomContext);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const navigate = useNavigate();
  const sendMsgBtn = useRef();
  const editor = useRef();
  const [selectedMsgId, setSelectedMsgId] = useState(null);

  // Persist current room in sessionStorage to maintain state through page reload
  if (currentRoom?.room) {
    sessionStorage.setItem("currentRoom", currentRoom.room[0]);
    sessionStorage.setItem("roomAdmin", currentRoom.room[1]);
    sessionStorage.setItem("roomAdminId", currentRoom.room[2]);
  }
  const currentRoomName = sessionStorage.getItem("currentRoom");
  const currentRoomAdmin = sessionStorage.getItem("roomAdmin");
  const currentRoomAdminId = sessionStorage.getItem("roomAdminId");

  // Set the current user online state
  useAuthRedirect();
  useEffect(() => {
    setUserStates({
      currentRoom: currentRoomName,
    });
    setUserOnline({
      currentRoom: currentRoomName,
    });
  }, [currentRoomName]);

  // Set the user state offline when the page loses focus
  useEffect(() => {
    return document.addEventListener("visibilitychange", (e) => {
      if (document.visibilityState === "hidden") {
        setUserOffline();
      } else {
        setUserOnline({
          currentRoom: currentRoomName,
        });
      }
    });
  }, [currentRoomName]);

  // scroll the chat to the bottom
  useEffect(() => {
    chat.current?.scrollTo(0, chat.current?.scrollHeight);
  }, [messages, props]);

  // Send the message
  const handleSend = () => {
    const html = convertToHTML(editorState.getCurrentContent());
    const textMsg = document.createElement("div");

    textMsg.innerHTML = html;
    if (
      !chat?.current ||
      !editorState.getCurrentContent().hasText() ||
      !textMsg.textContent
    )
      return;
    if (!sending.current) return handleEdit(textMsg);
    sendMsgUI({
      setEditorState,
      EditorState,
      textMsg,
      currentRoom: currentRoomName,
      isAdmin: auth.currentUser.uid === currentRoomAdminId,
      isSending: sending.current,
    });
    setEditorState(EditorState.createEmpty());
    editor.current.focusEditor();
  };

  // Edit the message
  const handleEdit = (textMsg) => {
    sendMsgUI({
      setEditorState,
      EditorState,
      textMsg,
      currentRoom: currentRoomName,
      isAdmin: auth.currentUser.uid === currentRoomAdminId,
      messageId: selectedMsgId,
      isSending: sending.current,
    });
    sending.current = true;
  };

  // set to edit mode
  const setToEdit = ({ messageId, oldMessage }) => {
    if (!messageId) return (sending.current = true);
    sending.current = false;
    setSelectedMsgId(messageId);
    if (!oldMessage) return;
    setEditorState(EditorState.createWithContent(stateFromHTML(oldMessage)));
  };

  // Cancel edit mode
  const cancelEdit = () => {
    setSelectedMsgId(null);
    setEditorState(EditorState.createEmpty());
    sending.current = true;
  };

  // Get the messages from the database
  useEffect(() => {
    // The only way I found to get the current room because the URL path is not related to the chat
    if (!currentRoomName) return navigate("/rooms");
    const unsubscribe = getMessagesFunc({ currentRoomName, setMessages });
    return () => unsubscribe;
  }, [currentRoomName, navigate]);

  // Mange user states
  useEffect(() => {
    if (!currentRoomName) return navigate("/rooms");
    const unsubscribe = manageUserSatesFunc({
      currentRoomName,
      setOnlineUsers,
    });
    return () => unsubscribe();
  }, [currentRoomName, navigate]);

  // Delete room
  const deleteRoom = async () => {
    await deleteRoomFunc({
      currentRoomName,
      navigate,
    });
  };

  useEffect(() => {
    const unsubscribe = async () => {
      if (!currentRoomName) return navigate("/rooms");
      const roomRef = doc(db, "rooms", currentRoomName);
      const room = await getDoc(roomRef);
      if (!room.exists()) navigate("/rooms");
    };
    return () => unsubscribe();
  });

  // send messages with the enter key
  function handleKeyCommand(command, editorState) {
    if (command.keyCode === 13) {
      command.preventDefault();
      handleSend();
      return "handled";
    } else if (command.keyCode === 27) {
      cancelEdit();
    } else return getDefaultKeyBinding(command, editorState);
  }

  // Set notifications

  // set to replay mode (Back to it later)
  // const setToReplay = ({ messageId, message, username }) => {
  //   setSelectedMsgId(messageId);
  //   // if (!message) return;
  //   // setEditorState(EditorState.createWithContent(stateFromHTML(message)));
  //   const messageRefContainer = document.createElement("div");
  //   const user = document.createElement("span");
  //   const messageRef = document.createElement("span");
  //   const replayIcon = document.createElement("span");

  //   messageRefContainer.className = "message-ref-container";
  //   user.className = "message-ref-user";
  //   messageRef.className = "message-ref";
  //   replayIcon.className = "replay-icon";

  //   user.innerHTML = username;
  //   // console.log(message);
  //   messageRef.innerHTML =
  //     message.length > 45 ? message.slice(0, 45) + "...<p></div>" : message;
  //   replayIcon.innerHTML = "↩";
  //   messageRefContainer.append(user, messageRef, replayIcon);
  //   document.getElementById("messages").append(messageRefContainer);
  // };

  return (
    <div id="chat" className="container">
      <Popup />
      <Nav pageName="rooms" preventDefault={false} />
      <div ref={chat} id="messages">
        <GetMessages
          messages={messages}
          currentRoom={currentRoomName}
          setToEdit={setToEdit}
          isSending={sending.current}
          selectedMsgId={selectedMsgId}
          cancelEdit={cancelEdit}
          // setToReplay={setToReplay}
        />
      </div>
      <button
        onClick={(e) => {
          sidebar.current?.classList.toggle("active");
          e.target?.classList.toggle("active");
        }}
        className="menu-btn"
      >
        &rarr;
      </button>

      <aside ref={sidebar} id="room-info">
        <h2 id="room-name">{currentRoomName}</h2>
        <h3>Admin: {currentRoomAdmin}</h3>
        {auth?.currentUser?.uid === currentRoomAdminId && (
          <button onClick={deleteRoom} className="btn" id="delete-room">
            Delete Room
          </button>
        )}
        <div id="online-users">
          <h3>Online users:</h3>
          <ul>
            {onlineUsers.map((user, i) => {
              return <li key={i}>{user.username}</li>;
            })}
          </ul>
        </div>
        <Link className="btn" id="go-back" to={"/rooms"}>
          Back
        </Link>
      </aside>

      <div id="input-field">
        <Editor
          ref={editor}
          editorState={editorState}
          onEditorStateChange={setEditorState}
          wrapperClassName="editor-wrapper"
          editorClassName="editor"
          toolbarClassName="toolbar"
          toolbar={{
            options: ["inline", "blockType", "list", "emoji"],
            inline: {
              inDropdown: false,
              options: ["bold", "italic", "underline"],
            },
            blockType: {
              inDropdown: true,
              options: ["H1", "unordered-list-item", "ordered-list-item"],
            },
          }}
          keyBindingFn={handleKeyCommand}
        />
        <div>
          <button ref={sendMsgBtn} onClick={handleSend} title="Send" id="send">
            SEND
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
