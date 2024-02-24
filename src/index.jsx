import React from "react";
import ReactDOM from "react-dom/client";
import "./sass/style.scss";
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import About from "./pages/About";
import Chat from "./pages/Chat";
import Rooms from "./pages/Rooms";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Header />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/rooms" element={<Rooms />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/sign-in" element={<SignIn />} />
    </Routes>
    <Footer />
  </BrowserRouter>
);
