import SendMsg from "./SendMsg";
import { auth } from "../firebase";
import editMsg from "./EditMsg";

const sendMsgUI = ({
  editorState,
  setEditorState,
  EditorState,
  textMsg,
  currentRoom,
  isAdmin,
  isSending,
  messageId,
}) => {
  const message = document.createElement("div");

  textMsg.className = "text-msg";
  message.append(textMsg);
  // get the username
  const username = auth.currentUser.displayName;
  // set the converted content
  const messageContent = message.innerHTML;
  // reset the editor
  setEditorState(EditorState.createEmpty());
  // send the message
  isSending
    ? SendMsg({ message: messageContent, username, currentRoom, isAdmin })
    : editMsg({ messageId, currentRoom, newMessage: messageContent });
};

export default sendMsgUI;
