import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { setPopup } from "../components/Popup";

const deleteRoomFunc = async ({ currentRoomName, navigate }) => {
  setPopup({
    heading: "Are you sure?",
    text: "Do you want to delete this room?",
    isPopup: true,
    options: true,
    onConfirm: () => {
      handleDelete(currentRoomName, navigate);
    },
    onCancel: () => {},
  });
};

const handleDelete = async (currentRoomName, navigate) => {
  const roomRef = doc(db, "rooms", currentRoomName);
  try {
    await deleteDoc(roomRef);
    await getDocs(collection(db, "rooms", currentRoomName, "messages")).then(
      (snapshot) => {
        snapshot.forEach((doc) => {
          deleteDoc(doc.ref);
        });
      }
    );
    navigate("/rooms");
  } catch (error) {
    setPopup({
      heading: "Error",
      text: `Something went wrong. Please try again later.\nError: ${error.message}`,
      isPopup: true,
      options: false,
      onConfirm: () => {},
      onCancel: () => {},
    });
  }
};

export default deleteRoomFunc;
