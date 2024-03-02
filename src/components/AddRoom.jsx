import addRoomFunc from "../helpers/addRoomFunc";
const AddRoom = ({ userId }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!e.target[0].value) return;
    addRoomFunc({ roomName: e.target[0].value, admin: userId });
    e.target[0].value = "";
  };

  return (
    <form onSubmit={handleSubmit} className="add-room" action="">
      <input
        id="add-room-input"
        type="text"
        placeholder="Enter room name..."
        spellCheck="false"
      />
      <button value="submit">+</button>
    </form>
  );
};

export default AddRoom;
