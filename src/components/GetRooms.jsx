import { useContext } from "react";
import { Link } from "react-router-dom";
import { RoomContext } from "../App";

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

const GetRooms = (props) => {
  const { rooms } = props;

  const chosenRoom = useContext(RoomContext);
  return rooms.map((room) => {
    // Prettify the room URL
    const roomURL = room.name.replace(/\s+/g, "-");
    // Get the date
    const seconds = room?.timestamp?.seconds || new Date().getSeconds();
    const date = new Date(seconds * 1000);
    // const formattedDate = date.toISOString().split("T")[0];
    const newFormattedDate = `${date.getDay()} ${months[date.getMonth()].slice(
      0,
      3
    )} ${date.getFullYear()}`;
    return (
      <Link
        onClick={() =>
          chosenRoom.setRoom([room.name, room.adminName, room.adminId])
        }
        key={room.id}
        to={`/chat/${roomURL}`}
        className="room"
      >
        <div className="room-name">{room.name}</div>
        <div className="online-users">
          <span className="count-online-users">{newFormattedDate}</span>
        </div>
      </Link>
    );
  });
};

export default GetRooms;
