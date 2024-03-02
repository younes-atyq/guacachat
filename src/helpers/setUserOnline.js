import {
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase";

const setUserOnline = async ({ currentRoom }) => {
  const username = auth?.currentUser?.displayName;
  const userId = auth?.currentUser?.uid;
  const roomRef = collection(db, "rooms", currentRoom, "onlineUsers");

  try {
    const userPresence = await getDoc(
      doc(
        db,
        "rooms",
        currentRoom,
        "onlineUsers",
        auth?.currentUser?.displayName
      )
    );

    if (userPresence.exists()) return;

    setDoc(doc(roomRef, username), {
      username,
      userId,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.log("Error", error.message);
  }
};

export default setUserOnline;
