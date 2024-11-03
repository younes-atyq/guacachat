import Nav from "../components/Nav";
import useAuthRedirect from "../hooks/useAuthRedirect.js";
import { auth, colRooms } from "../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useEffect, useRef, useState } from "react";
import { onSnapshot, orderBy, query, where } from "firebase/firestore";
import Popup from "../components/Popup";
import GetRooms from "../components/GetRooms";
import AddRoom from "../components/AddRoom";
import { debounce } from "lodash";
import setUserOffline from "../helpers/setUserOffline.js";
import SearchIcon from "@mui/icons-material/Search";

const Rooms = () => {
  useAuthRedirect();
  setUserOffline();
  const [username, setUsername] = useState("");
  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState("");
  const sidebar = useRef();

  const debouncedSetSearch = debounce(setSearch, 200);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUsername(user.displayName);
    }
  });

  // Useless search button
  const handleSearch = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    let q;
    if (!search) q = query(colRooms, orderBy("timestamp", "desc"));
    else
      q = query(
        colRooms,
        where("name", ">=", search),
        where("name", "<=", search + "\uf8ff")
      );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const rooms = [];
      snapshot.forEach((doc) => {
        rooms.push({ ...doc.data(), id: doc.id });
      });
      setRooms(rooms);
    });
    return () => unsubscribe();
  }, [search]);

  // Get Online users
  // useEffect(() => {
  //   rooms.forEach((room) => {
  //     console.log(room);
  //   });
  // }, [rooms]);

  // useEffect(() => {
  //   const unsubscribeCallbacks = rooms.map((room) => {
  //     const roomRef = collection(db, "rooms", room.name, "onlineUsers");
  //     const unsubscribe = onSnapshot(roomRef, (snapshot) => {
  //       const onlineUsers = snapshot.docs.filter(
  //         (doc) => doc.data().state === "online"
  //       ).length;
  //       console.log(onlineUsers);
  //       setOnlineUsers((users) => users + onlineUsers);
  //     });

  //     return unsubscribe;
  //   });

  //   return () => {
  //     unsubscribeCallbacks.forEach((unsubscribe) => unsubscribe());
  //   };
  // }, [rooms]);

  return (
    <div id="rooms" className="container">
      <Nav pageName="rooms" />
      <Popup />
      <div id="search">
        <form onSubmit={handleSearch} action="#">
          <input
            type="text"
            placeholder="Search for rooms..."
            id="search-input"
            className="search-input"
            onChange={(e) => debouncedSetSearch(e.target.value)}
          />
          <button value="submit" id="search-icon">
            <SearchIcon />
          </button>
        </form>
      </div>
      <button
        onClick={(e) => {
          sidebar.current?.classList.toggle("active");
          e.target?.classList.toggle("active");
        }}
        className="menu-btn"
      >
        &rarr;
      </button>
      <aside ref={sidebar} id="user-information">
        <h2 id="username">{username}</h2>
        <button id="logout" onClick={() => signOut(auth)}>
          Logout
        </button>
      </aside>
      <div id="results">
        <AddRoom />
        <GetRooms rooms={rooms} />
      </div>
    </div>
  );
};

export default Rooms;
