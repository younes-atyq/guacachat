import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { setPopup } from "../components/Popup";

const deleteMsg = async (messageId, currentRoom) => {
  setPopup({
    heading: "Are you sure?",
    text: "Do you want to delete this message?",
    isPopup: true,
    options: true,
    onConfirm: () => {
      handleDelete(currentRoom, messageId);
    },
    onCancel: () => {},
  });
};

const handleDelete = async (currentRoom, messageId) => {
  try {
    const docRef = doc(db, "rooms", currentRoom, "messages", messageId);
    deleteDoc(docRef);
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

export default deleteMsg;
