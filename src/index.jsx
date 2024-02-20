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

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Header />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/rooms" element={<Rooms />} />
      <Route path="/chat" element={<Chat />} />
    </Routes>
    <Footer />
  </BrowserRouter>
);
