import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { setPopup } from "../components/Popup";

/**
 * Add a new room to the database if it doesn't already exist.
 * If the room already exists, an error is thrown.
 *
 * @param {Object} param0 - An object containing roomName and admin (user ID) properties.
 * @param {string} param0.roomName - The name of the room to be added.
 * @param {string} param0.admin - The ID of the user who will be the admin of the new room.
 * @return {Promise<void>} A promise that resolves once the room is added to the database.
 */
const AddRoomFunc = async ({ roomName, admin }) => {
  try {
    const room = await getDoc(doc(db, "rooms", roomName));

    if (room.exists()) throw new Error("Room already exists");
    await setDoc(doc(db, "rooms", roomName), {
      name: roomName,
      admin,
      timestamp: serverTimestamp(),
      messages: [],
    });
    console.log("room added");
  } catch (error) {
    setPopup({ isPopup: true, heading: "Error", text: error.message });
  }
};

export default AddRoomFunc;
