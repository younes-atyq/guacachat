import { useEffect, useRef, useState } from "react";
import Nav from "../components/Nav";
import { EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import { convertToHTML } from "draft-convert";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const sendIcon = (
  <svg
    width="80"
    height="40"
    viewBox="0 0 268 84"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M109.5 1V83H267V1M109.5 1H188.25H267M109.5 1L188.25 35.5L267 1M93 18.5H0M89 35.5H38.5M93 53.5H0"
      stroke="black"
      strokeWidth="5"
    />
  </svg>
);

const Chat = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [convertedContent, setConvertedContent] = useState("");
  const chat = useRef();
  // scroll the chat to the bottom
  const scrollToBottom = () => {
    chat.current?.scrollTo(0, chat.current?.scrollHeight);
  };
  useEffect(() => {
    scrollToBottom();
  }, []);

  const handleClick = () => {
    if (!chat?.current) return;
    const html = convertToHTML(editorState.getCurrentContent());
    setConvertedContent(html);

    const message = document.createElement("div");
    message.className = "message";

    const textMsg = document.createElement("p");

    textMsg.innerHTML = convertedContent;
    textMsg.className = "text-msg";

    const name = document.createElement("h3");
    name.className = "name";
    // I'll use the data base to get the name in the future
    name.innerHTML = "John Doe <span class='time'>10:00</span>";

    message.append(name);
    message.append(textMsg);

    chat.current.appendChild(message);

    scrollToBottom();
    // reset the editor
    setEditorState(EditorState.createEmpty());
  };

  // "ctrl + enter" method has an issue
  // useEffect(() => {
  //   document.addEventListener("keydown", (e) => {
  //     if (e.ctrlKey && e.key === "Enter") {
  //       e.preventDefault();
  //       handleClick();
  //     }
  //   });
  // }, []);

  return (
    <div id="chat" className="container">
      <Nav pageName="rooms" />
      <div ref={chat} id="messages">
        <div className="message">
          <h3 className="name">
            John Doe <span className="time">10:00</span>
            <span className="read"></span>
          </h3>
          <p className="text-msg">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
            tincidunt, mauris vitae tincidunt tincidunt, mauris vitae tincidunt
          </p>
        </div>
        <div className="message">
          <h3 className="name">
            John Doe <span className="time">10:00</span>
            <span className="read"></span>
          </h3>
          <p className="text-msg">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
            tincidunt, mauris vitae tincidunt tincidunt, mauris vitae tincidunt
          </p>
        </div>
        <div className="message">
          <h3 className="name">
            John Doe <span className="time">10:00</span>
            <span className="read"></span>
          </h3>
          <p className="text-msg">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
            tincidunt, mauris vitae tincidunt tincidunt, mauris vitae tincidunt
          </p>
        </div>
      </div>
      <aside id="room">
        <h2 id="room-name">First Chat Room</h2>
        <p id="room-info">
          Online users : <span id="online-users">2</span>
        </p>
        <ul id="users">
          <li className="user">John Doe</li>
          <li className="user">John Doe</li>
        </ul>
      </aside>
      <div id="input-field">
        <Editor
          editorState={editorState}
          onEditorStateChange={setEditorState}
          wrapperClassName="editor-wrapper"
          editorClassName="editor"
          toolbarClassName="toolbar"
          toolbar={{
            options: ["inline", "blockType", "list"],
            inline: {
              inDropdown: false,
              options: ["bold", "italic", "underline"],
            },
            blockType: {
              inDropdown: true,
              options: ["H1", "H2", "unordered-list-item", "ordered-list-item"],
            },
          }}
        />
        <div>
          <button onClick={handleClick} title="Ctrl + Enter" id="send">
            {sendIcon}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
