import React, { useState, useRef, useEffect } from "react";
import socket from "../../Socket";
import "./chat.css"

function Chat({ users, messages, userName, roomId }) {
  const [messageValue, setMessageValue] = useState("");
  const messagesRef = useRef(null);

  const onSendMessage = () => {
    socket.emit("ROOM:NEW_MESSAGE", {
      userName,
      roomId,
      text: messageValue,
      date: new Date().toLocaleTimeString("ru-RU"),
    });
    setMessageValue("");
  };

  useEffect(() => {
    messagesRef.current.scroll(0, messagesRef.current.scrollHeight);
  }, [messages]);

  return (
    <div className="chat">
      <div className="chat-users">
        Комната: <b>{roomId}</b>
        <hr />
        <b>Онлайн ({users.length}):</b>
        <ul>
          {users.map((name, index) => (
            <li key={`${name}-${index}`}>{name}</li>
          ))}
        </ul>
      </div>
      <div className="chat-messages">
        <div ref={messagesRef} className="messages">
          {messages.map((message, index) => (
            <div className="message" key={`${message}-${index}`}>
              <p>{message.text}</p>
              <div>
                <span>{message.userName}</span>
                <span> - </span>
                <span>{message.date}</span>
              </div>
            </div>
          ))}
        </div>
        <form>
          <textarea
            value={messageValue}
            onChange={(e) => setMessageValue(e.target.value)}
            className="form-control"
            rows="3"
          ></textarea>

          <button
            onClick={onSendMessage}
            type="button"
            className="btn btn_chat"
            disabled={!messageValue}
          >
            Отправить
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
