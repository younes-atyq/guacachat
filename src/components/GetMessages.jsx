import { useEffect } from "react";
import { auth } from "../firebase.js";
import deleteMsg from "../helpers/DeleteMsg.js";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";

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
  const {
    messages,
    currentRoom,
    setToEdit,
    isSending,
    selectedMsgId,
    cancelEdit,
    // setToReplay,
  } = props;
  let prevTime = null;

  const handleOptionsClick = (e) => {
    document.querySelectorAll(".option-icon").forEach((el) => {
      el.classList.remove("show");
    });
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
    };

    // const handleReplay = () => {
    //   setToReplay({
    //     messageId: message.id,
    //     message: message.message,
    //     username: message.username,
    //   });
    // };

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
          {!isSending && selectedMsgId === message.id && (
            <button onClick={cancelEdit} className="cancel-editing">
              <CancelPresentationIcon />
            </button>
          )}
          {/* This condition will be removed when the reply function is added */}
          {message.userId === auth.currentUser.uid && (
            <button onClick={handleOptionsClick} className="option-icon">
              <MoreVertIcon />
            </button>
          )}
          <ul className="options">
            {/* <button onClick={handleReplay}>REPLY</button> */}
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
