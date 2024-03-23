import { serverTimestamp, addDoc, collection } from "firebase/firestore";
import { analytics, db } from "../firebase";

const sendMsg = ({ message, username, currentRoom, isAdmin }) => {
  if (message) {
    const colRef = collection(db, "rooms", currentRoom, "messages");
    addDoc(colRef, {
      message,
      username,
      timestamp: serverTimestamp(),
      isAdmin: isAdmin ? true : false,
    });
    analytics("message_sent", { message });
  } else {
    console.log("no message");
  }
};

export default sendMsg;
