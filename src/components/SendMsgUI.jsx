// import { useState } from "react";
import { convertToHTML } from "draft-convert";
import SendMsg from "./SendMsg";
import { auth } from "../firebase";

const SendMsgUI = ({ editorState, setEditorState, EditorState, chat }) => {
  const html = convertToHTML(editorState.getCurrentContent());
  console.log(html.toString().indexOf('<p class="text-msg"><p></p></p>'));
  if (html.toString().indexOf('<p class="text-msg"><p></p></p>') !== -1) return;

  const message = document.createElement("div");

  const textMsg = document.createElement("p");

  textMsg.innerHTML = html;
  textMsg.className = "text-msg";

  const name = document.createElement("h3");
  name.className = "name";
  // get the username
  const username = auth.currentUser.displayName;
  // get the current time
  let currentMinute = new Date().getMinutes();
  let currentHour = new Date().getHours();
  if (currentHour < 10) {
    currentHour = "0" + currentHour;
  }
  if (currentMinute < 10) {
    currentMinute = "0" + currentMinute;
  }
  const time = currentHour + ":" + currentMinute;

  name.innerHTML = `${username} <span class='time'>${time}</span>`;
  // append the name and the message
  message.append(name);
  message.append(textMsg);

  // chat?.append(message);

  // set the converted content
  const messageContent = message.innerHTML;

  // reset the editor
  setEditorState(EditorState.createEmpty());
  // send the message
  SendMsg({ message: messageContent, username });
};

export default SendMsgUI;
