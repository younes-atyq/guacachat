import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
const editMsg = async ({ messageId, currentRoom, newMessage }) => {
  const docRef = doc(db, "rooms", currentRoom, "messages", messageId);
  updateDoc(docRef, {
    message: newMessage,
    edited: true,
  });
  return;
};

export default editMsg;
