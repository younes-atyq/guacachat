import { useContext } from "react";
import { Link } from "react-router-dom";
import { RoomContext } from "../App";

const GetRooms = (props) => {
  const { rooms } = props;
  const chosenRoom = useContext(RoomContext);
  return rooms.map((room) => {
    const roomURL = room.name.replace(/\s+/g, "-");
    return (
      <Link
        onClick={() => chosenRoom.setRoom(room.name)}
        key={room.id}
        to={`/chat/${roomURL}`}
        className="room"
      >
        <div className="room-name">{room.name}</div>
        <div className="online-users">
          Online: <span className="count-online-users">{"(:"}</span>
        </div>
      </Link>
    );
  });
};

export default GetRooms;
