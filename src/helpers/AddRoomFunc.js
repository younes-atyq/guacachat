import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { setPopup } from "../components/Popup";

// Add a new room to the database, and throw an error if the room already exists.
const addRoomFunc = async ({ roomName, admin }) => {
  try {
    const room = await getDoc(doc(db, "rooms", roomName));

    if (room.exists()) throw new Error("Room already exists");
    await setDoc(doc(db, "rooms", roomName), {
      name: roomName,
      admin,
      timestamp: serverTimestamp(),
      messages: [],
      onlineUsers: [],
    });
    console.log("room added");
  } catch (error) {
    setPopup({ isPopup: true, heading: "Error", text: error.message });
  }
};

export default addRoomFunc;
