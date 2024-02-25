import React from "react";
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import About from "./pages/About";
import Chat from "./pages/Chat";
import Rooms from "./pages/Rooms";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase.js";

const App = () => {
  const navigate = useNavigate();

  onAuthStateChanged(auth, (user) => {
    console.log(user ? "user is signed in" : "user is signed out");
    if (user) {
      navigate("/rooms");
    } else {
      navigate("/sign-in");
    }
  });
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
