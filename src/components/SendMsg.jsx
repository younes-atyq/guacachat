import {
  doc,
  setDoc,
  serverTimestamp,
  addDoc,
  collection,
} from "firebase/firestore";
import { db } from "../firebase";

const SendMsg = ({ message, username }) => {
  const docRef = doc(db, "messages", Date.now().toString());
  const colRef = collection(db, "messages");
  if (message) {
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
