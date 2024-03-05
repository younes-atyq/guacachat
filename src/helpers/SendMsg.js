import { serverTimestamp, addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";

const sendMsg = ({ message, username, currentRoom }) => {
  if (message) {
    const colRef = collection(db, "rooms", currentRoom, "messages");
    addDoc(colRef, {
      message,
      username,
      timestamp: serverTimestamp(),
    });
  } else {
    console.log("no message");
  }
};

export default sendMsg;
