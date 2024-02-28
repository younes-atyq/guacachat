import { serverTimestamp, addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";

const SendMsg = ({ message, username, currentRoom }) => {
  if (message) {
    const colRef = collection(db, "rooms", currentRoom, "messages"); // Assuming 'rooms' is the main collection
    addDoc(colRef, {
      message,
      username,
      timestamp: serverTimestamp(),
    });
  } else {
    console.log("no message");
  }
};

export default SendMsg;
