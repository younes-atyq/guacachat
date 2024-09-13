import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
const deleteMsg = (messageId, currentRoom) => {
  const docRef = doc(db, "rooms", currentRoom, "messages", messageId);
  deleteDoc(docRef);

  return;
};

export default deleteMsg;
