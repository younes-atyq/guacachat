import { serverTimestamp, addDoc, collection } from "firebase/firestore";
import { db, auth } from "../firebase";

const sendMsg = ({ message, username, currentRoom, isAdmin }) => {
  if (message) {
    const colRef = collection(db, "rooms", currentRoom, "messages");
    addDoc(colRef, {
      message,
      username,
      timestamp: serverTimestamp(),
      isAdmin: isAdmin ? true : false,
      userId: auth.currentUser.uid,
    });
  } else {
    console.log("no message");
  }
};

export default sendMsg;
