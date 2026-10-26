import { serverTimestamp, addDoc, collection } from "firebase/firestore";
import { db, auth } from "../firebase";

// A message is either HTML text or a GIF ({ url, title, width, height }).
const sendMsg = ({ message, gif, username, currentRoom, isAdmin }) => {
  if (message || gif) {
    const colRef = collection(db, "rooms", currentRoom, "messages");
    addDoc(colRef, {
      message: message || "",
      ...(gif && { gif }),
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
