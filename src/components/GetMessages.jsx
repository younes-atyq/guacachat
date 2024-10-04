import { useEffect } from "react";
import { auth } from "../firebase.js";
import deleteMsg from "../helpers/DeleteMsg.js";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const GetMessages = (props) => {
  const { messages, currentRoom, handleEdit, setToEdit } = props;
  let prevTime = null;

  const handleOptionsClick = (e) => {
    e.target.classList.toggle("show");
  };

  useEffect(() => {
    return window.addEventListener("click", (e) => {
      if (e.target.classList.contains("option-icon")) return;
      document.querySelectorAll(".option-icon").forEach((el) => {
        el.classList.remove("show");
      });
    });
  });

  return messages.map((message, i) => {
    let time,
      fullTime,
      currentMinute,
      currentHour,
      currentDay,
      currentMonth,
      currentYear,
      isTheSameDay = true;

    const handleDeleteMsg = () => {
      deleteMsg(message.id, currentRoom);
    };

    const handleEditMsg = () => {
      setToEdit({
        messageId: message.id,
        oldMessage: message.message,
      });
      // handleEdit({
      //   messageId: message.id,
      //   oldMessage: message.message,
      // });
    };

    if (message?.timestamp) {
      const localDate = new Date(message.timestamp.toDate());
      currentMinute = localDate.getMinutes();
      currentHour = localDate.getHours();
      currentDay = localDate.getDate();
      currentMonth = localDate.getMonth();
      currentYear = localDate.getFullYear();
      // format the time
      currentHour = currentHour < 10 ? "0" + currentHour : currentHour;
      currentMinute = currentMinute < 10 ? "0" + currentMinute : currentMinute;
      time = currentHour + ":" + currentMinute;
      fullTime =
        currentDay + "/" + months[currentMonth].slice(0, 3) + "/" + currentYear;
      isTheSameDay = prevTime === fullTime;
      prevTime = fullTime;
    }

    return (
      <div key={message.id} className="message-container" id={message.id}>
        {!isTheSameDay && (
          <div className="message-break">
            <div className="line"></div>
            {fullTime} <div className="line"></div>
          </div>
        )}
        <div className="message">
          {message?.edited && <span className="edited">Edited</span>}
          <span className={message?.isAdmin ? "name admin" : "name"}>
            {message.username} <span className="time">{time}</span>
          </span>
          <div dangerouslySetInnerHTML={{ __html: message.message }}></div>
          <button onClick={handleOptionsClick} className="option-icon">
            <MoreVertIcon />
          </button>
          <ul className="options">
            <button>REPLY</button>
            {message.userId === auth.currentUser.uid && (
              <>
                <button onClick={handleEditMsg}>EDIT</button>
                <button onClick={handleDeleteMsg}>DELETE</button>
              </>
            )}
          </ul>
        </div>
      </div>
    );
  });
};

export default GetMessages;
