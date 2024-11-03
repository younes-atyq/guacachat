import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const manageUserSatesFunc = ({ currentRoomName, setOnlineUsers }) => {
  const roomRef = collection(db, "rooms", currentRoomName, "onlineUsers");
  return onSnapshot(roomRef, (users) => {
    const onlineUsers = [];
    users.forEach((user) => {
      if (user.data().state === "offline") return;
      onlineUsers.push({
        username: user.data().username,
        userId: user.data().userId,
      });
    });
    setOnlineUsers(onlineUsers);
  });
};

export default manageUserSatesFunc;
