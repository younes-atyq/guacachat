import React, { createContext, useEffect, useState } from "react";
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import About from "./pages/About";
import Chat from "./pages/Chat";
import Rooms from "./pages/Rooms";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import { auth, rtdb } from "./firebase";
import { onDisconnect, onValue, ref, set } from "firebase/database";

export const RoomContext = createContext();

const App = () => {
  const [room, setRoom] = useState(null);

  // New presence system
  useEffect(() => {
    const handleUserPresence = (user) => {
      if (user) {
        const userStatusDatabaseRef = ref(rtdb, `presence/${user.uid}`);

        // Write a string when this device is offline
        const isOfflineForDatabase = {
          state: "offline",
          last_changed: new Date().toISOString(),
          username: user.displayName,
        };

        // Write a string when this device is online
        const isOnlineForDatabase = {
          state: "online",
          last_changed: new Date().toISOString(),
          username: user.displayName,
        };

        onDisconnect(userStatusDatabaseRef)
          .set(isOfflineForDatabase)
          .then(() => {
            set(userStatusDatabaseRef, isOnlineForDatabase);
          });

        // Optionally, you can also listen for changes in the user's connection state
        const connectedRef = ref(rtdb, ".info/connected");
        onValue(connectedRef, (snap) => {
          if (snap.val() === true) {
            set(userStatusDatabaseRef, isOnlineForDatabase);
          } else {
            set(userStatusDatabaseRef, isOfflineForDatabase);
          }
        });
      }
    };

    const unsubscribe = auth.onAuthStateChanged(handleUserPresence);

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <RoomContext.Provider value={{ room, setRoom }}>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/chat/:room" element={<Chat />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-in" element={<SignIn />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </RoomContext.Provider>
  );
};

export default App;
