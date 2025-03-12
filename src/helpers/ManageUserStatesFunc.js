import { collection, onSnapshot } from "firebase/firestore";
import { db, rtdb } from "../firebase";
import { onValue, ref } from "firebase/database";

const manageUserSatesFunc = ({ currentRoomName, setOnlineUsers }) => {
  const roomRef = collection(db, "rooms", currentRoomName, "onlineUsers");
  const connectedRef = ref(rtdb, "presence");
  const offlineUsers = [];

  return onValue(
    connectedRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const users = snapshot.val(); // Get the object containing user IDs

        for (const userId in users) {
          if (users.hasOwnProperty(userId)) {
            const userData = users[userId];
            if (userData.state === "offline") offlineUsers.push(userId);
            // Update your UI with userData (userData.state, userData.username, etc.)
          }
        }
      } else {
        console.log("No presence data available.");
      }
      onSnapshot(roomRef, (users) => {
        const onlineUsers = [];
        users.forEach((user) => {
          if (
            user.data().state === "offline" ||
            offlineUsers.find((d) => d === user.data().userId)
          )
            return;
          onlineUsers.push({
            username: user.data().username,
            userId: user.data().userId,
          });
        });
        setOnlineUsers(onlineUsers);
      });
    },
    (error) => {
      console.error("Error in onValue:", error);
    }
  );
};

export default manageUserSatesFunc;
