import { useContext, useEffect, useRef, useState } from "react";
import Nav from "../components/Nav";
import { EditorState, getDefaultKeyBinding, KeyBindingUtil } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import useAuthRedirect from "../hooks/useAuthRedirect";
import sendMsgUI from "../helpers/SendMsgUI";
import { auth, db, queryCurrentRoomMessages } from "../firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { RoomContext } from "../App";
import setUserOnline from "../helpers/setUserOnline";
import { Link, useNavigate } from "react-router-dom";
import setUserStates from "../helpers/setUserStates";
import Popup from "../components/Popup";
import GetMessages from "../components/GetMessages";
import { stateFromHTML } from "draft-js-import-html";
import { convertToHTML } from "draft-convert";

const { hasCommandModifier } = KeyBindingUtil;

const Chat = (props) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [messages, setMessages] = useState([]);
  // const [isSending, setIsSending] = useState(true);
  const sending = useRef(true);
  const chat = useRef();
  const sidebar = useRef();
  const currentRoom = useContext(RoomContext);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const navigate = useNavigate();
  const sendMsgBtn = useRef();
  const editor = useRef();
  const [selectedMsgId, setSelectedMsgId] = useState(null);
  // let userState;

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
  setUserStates({
    currentRoom: currentRoomName,
  });

  setUserOnline({
    currentRoom: currentRoomName,
  });

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
    sendMsgUI({
      editorState,
      setEditorState,
      EditorState,
      textMsg,
      currentRoom: currentRoomName,
      isAdmin: auth.currentUser.uid === currentRoomAdminId,
      isSending: sending.current,
    });
  };

  // Edit the message
  const handleEdit = () => {
    if (!chat?.current || !editorState.getCurrentContent().hasText()) return; // (sending.current = true);
    sendMsgUI({
      editorState,
      setEditorState,
      EditorState,
      currentRoom: currentRoomName,
      isAdmin: auth.currentUser.uid === currentRoomAdminId,
      messageId: selectedMsgId,
      isSending: sending.current,
    });
    sending.current = true;
  };

  // Get the messages from the database
  useEffect(() => {
    // The only way I found to get the current room because the URL path is not related to the chat
    let room = currentRoomName;
    const unsubscribe = onSnapshot(
      queryCurrentRoomMessages(room),
      (snapshot) => {
        let messages = [];
        if (!snapshot) return;
        snapshot.forEach((doc) => {
          messages.push({ ...doc.data(), id: doc.id });
        });
        setMessages(messages);
      }
    );
    return () => unsubscribe();
  }, [currentRoomName]);

  // Mange user states
  useEffect(() => {
    const roomRef = collection(db, "rooms", currentRoomName, "onlineUsers");
    const unsubscribe = onSnapshot(roomRef, (users) => {
      const onlineUsers = [];
      users.forEach((user) => {
        if (user.data().state === "offline") return;
        onlineUsers.push({
          username: user.data().username,
          userId: user.data().userId,
        });
      });
      setOnlineUsers(onlineUsers);
    });
    return () => unsubscribe();
  }, [currentRoomName]);

  // Delete room
  const deleteRoom = async () => {
    const roomRef = doc(db, "rooms", currentRoomName);
    try {
      await deleteDoc(roomRef);
      await getDocs(collection(db, "rooms", currentRoomName, "messages")).then(
        (snapshot) => {
          snapshot.forEach((doc) => {
            deleteDoc(doc.ref);
          });
        }
      );
      navigate("/rooms");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const unsubscribe = async () => {
      const roomRef = doc(db, "rooms", currentRoomName);
      const room = await getDoc(roomRef);
      if (!room.exists()) navigate("/rooms");
    };
    return () => unsubscribe();
  });

  // set to edit mode
  const setToEdit = ({ messageId, oldMessage }) => {
    sending.current = false;
    setSelectedMsgId(messageId);
    if (!oldMessage) return;
    setEditorState(EditorState.createWithContent(stateFromHTML(oldMessage)));
  };

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

  // // "ctrl + enter" method has an issue
  useEffect(() => {
    const unsubscribe = document.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && hasCommandModifier(e)) {
        e.preventDefault();
        console.log("GET IN");
        sendMsgBtn.current.click();
      }
    });
    return () => unsubscribe;
  }, [editorState]);
  // const handleShortcutSend = (e) => {
  //   if (!chat?.current || !editorState.getCurrentContent().hasText()) return;
  //   if (e.key === "Enter" && hasCommandModifier(e)) {
  //     return "send-message";
  //   }
  //   return getDefaultKeyBinding(e);
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
            options: ["inline", "blockType", "list"],
            inline: {
              inDropdown: false,
              options: ["bold", "italic", "underline"],
            },
            blockType: {
              inDropdown: true,
              options: ["H1", "unordered-list-item", "ordered-list-item"],
            },
          }}
          // make it send message when click on ctrl + enter
          // handleKeyCommand={(command, editorState) => {
          //   if (command === "send-message") {
          //     sendMsgBtn.current.click();
          //     return "handled";
          //   }
          //   return "not-handled";
          // }}
        />
        <div>
          <button
            ref={sendMsgBtn}
            onClick={sending.current ? handleSend : handleEdit}
            // title="Ctrl + Enter"
            id="send"
          >
            SEND
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
