import { onSnapshot } from "firebase/firestore";
import { queryCurrentRoomMessages } from "../firebase";

const getMessagesFunc = async ({ currentRoomName, setMessages }) => {
  return onSnapshot(queryCurrentRoomMessages(currentRoomName), (snapshot) => {
    let messages = [];
    if (!snapshot) return;
    snapshot.forEach((doc) => {
      messages.push({ ...doc.data(), id: doc.id });
    });
    setMessages(messages);
  });
};

export default getMessagesFunc;
