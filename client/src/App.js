import React, { useEffect, useReducer, useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import socket from "./Socket";
import reducer from "./reducer";
import JoinRoom from "./components/joinRoom/JoinRoom";
import JoinName from "./components/joinName/JoinName";
import Room from "./components/room/Room";
import axios from "axios";
import URL from "./hostUrl"

function App() {

  // Our state from server response
  const [state, dispatch] = useReducer(reducer, {
    joined: false,
    roomId: null,
    userName: null,
    users: [],
    messages: [],
  });
  const [name, setName] = useState("");

  // Connect to select room function
  const onLogin = async (userData) => {
    try {
      await axios.post(`${URL}/rooms`, userData);
    } catch (error) {
      return;
      // TODO error message to user or reconnect
    }
    dispatch({
      type: "JOINED",
      payload: userData,
    });
    socket.emit("ROOM:JOIN", userData);
  };

  const setUsers = (users) => {
    dispatch({
      type: "SET_USERS",
      payload: users,
    });
  };

  const addMessage = (message) => {
    dispatch({
      type: "NEW_MESSAGE",
      payload: message,
    });
  };

  useEffect(() => {
    socket.on("ROOM:SET_USERS", setUsers);
    socket.on("ROOM:NEW_MESSAGE", addMessage);
  }, []);

  return (
    <div className="wrapper">
      <BrowserRouter>
        <Switch>
          <Route path="/" exact render={() => <JoinName onLogin={onLogin} name={name} setName={setName} />} />
          <Route path="/room" exact render={() => <JoinRoom onLogin={onLogin} name={name}/>} />
          <Route
            path="/room/:roomId"
            render={() => <Room onLogin={onLogin} {...state} name={name} setName={setName}/>}
          />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
