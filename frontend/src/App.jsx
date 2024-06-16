import { useState, useEffect } from "react";
import "./App.css";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

function App() {
  const [userName, setUserName] = useState("");
  const [chatActive, setChatActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const messageData = {
      message: newMessage,
      user: userName,
      time: new Date().getHours() + ":" + new Date().getMinutes(),
    };
    if (newMessage !== "") {
      socket.emit("new-message", messageData);
      setNewMessage("");
    } else {
      alert("Message cannot be empty");
    }
  };

  useEffect(() => {
    socket.on("received-message", (data) => {
      setMessages([...messages, data]);
    });
  }, [messages]);

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-blue-100">
      {chatActive ? (
        <div className="chat-container rounded-md p-2 w-full md:w-[80vw] lg:w-[40vw] mx-auto">
          <h1 className="text-center font-bold text-xl my-2 uppercase">
            Chat box live
          </h1>
          <div>
            <div className="overflow-y-scroll h-[80vh] lg:h-[60vh]">
              {messages.map((msg, index) => {
                const isOwnMessage = userName === msg.user;
                return (
                  <div
                    key={index}
                    className={`message-container flex rounded-md shadow-md my-5 w-fit ${
                      isOwnMessage ? "ml-auto" : ""
                    }`}
                  >
                    <div className="message-sender flex justify-center items-center rounded-l-md">
                      <h3 className="font-bold text-lg px-2">
                        {msg.user.charAt(0).toUpperCase()}
                      </h3>
                    </div>
                    <div className="message-content px-2 rounded-r-md">
                      <span className="text-sm">{msg.user}</span>
                      <h3 className="font-bold">{msg.message}</h3>
                      <h3 className="text-xs text-right">{msg.time}</h3>
                    </div>
                  </div>
                );
              })}
            </div>
            <form className="form-container" onSubmit={handleSubmit}>
              <input
                onChange={(e) => setNewMessage(e.target.value)}
                value={newMessage}
                type="text"
                className="message-input border-2 outline-none px-3 py-2 rounded-md"
                placeholder="Type your message here.."
              />
              <button type="submit" className="send-button">
                Send
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="start-chat-container">
          <input
            type="text"
            className="username-input px-3 py-2 outline-none border-2 rounded-md"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter your name"
          />
          <button
            className="start-chat-button"
            type="submit"
            onClick={() => userName !== "" && setChatActive(true)}
          >
            Start Chat
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
