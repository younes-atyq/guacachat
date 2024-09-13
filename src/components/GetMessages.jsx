const GetMessages = (props) => {
  const { messages } = props;

  let prevTime = null;

  return messages.map((message, i) => {
    let time,
      fullTime,
      currentMinute,
      currentHour,
      currentDay,
      currentMonth,
      currentYear,
      isTheSameDay = false;

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
      fullTime = currentDay + "/" + currentMonth + "/" + currentYear;
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
      </div>
    );
  });
};

export default GetMessages;
