import { auth } from "../firebase.js";
import deleteMsg from "../helpers/DeleteMsg.js";

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
  const { messages, currentRoom } = props;

  let prevTime = null;

  return messages.map((message, i) => {
    let time,
      fullTime,
      currentMinute,
      currentHour,
      currentDay,
      currentMonth,
      currentYear,
      isTheSameDay = true;

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
      <div className="message-container">
        {!isTheSameDay && (
          <div className="message-break">
            <div className="line"></div>
            {fullTime} <div className="line"></div>
          </div>
        )}
        <div key={i} className="message">
          <span className={message?.isAdmin ? "name admin" : "name"}>
            {message.username} <span className="time">{time}</span>
          </span>
          <div dangerouslySetInnerHTML={{ __html: message.message }}></div>
        </div>
        {message.userId === auth.currentUser.uid && (
          <button
            className="delete-msg"
            onClick={() => deleteMsg(message.id, currentRoom)}
          >
            Delete
          </button>
        )}
      </div>
    );
  });
};

export default GetMessages;
