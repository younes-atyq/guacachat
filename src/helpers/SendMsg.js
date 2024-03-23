import { serverTimestamp, addDoc, collection } from "firebase/firestore";
import { analytics, db } from "../firebase";
import { logEvent } from "firebase/analytics";

const sendMsg = ({ message, username, currentRoom, isAdmin }) => {
  if (message) {
    const colRef = collection(db, "rooms", currentRoom, "messages");
    addDoc(colRef, {
      message,
      username,
      timestamp: serverTimestamp(),
      isAdmin: isAdmin ? true : false,
    });
    // logEvent(analytics, "message_sent", { name: currentRoom });
  } else {
    console.log("no message");
  }
};

export default sendMsg;
