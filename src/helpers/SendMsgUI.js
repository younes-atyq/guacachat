import SendMsg from "./SendMsg";
import { auth } from "../firebase";
import editMsg from "./EditMsg";

const sendMsgUI = ({
  messageContent,
  currentRoom,
  isAdmin,
  isSending,
  messageId,
}) => {
  const username = auth.currentUser.displayName;
  // send or edit the message
  isSending
    ? SendMsg({ message: messageContent, username, currentRoom, isAdmin })
    : editMsg({ messageId, currentRoom, newMessage: messageContent });
};

export default sendMsgUI;
