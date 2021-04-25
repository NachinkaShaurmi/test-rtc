import React from "react";
import Chat from "../chat/Chat";
import JoinName from "../joinName/JoinName";

const Room = (props) => {
  return (
    <div>
      {props.joined ? (
        <Chat {...props} />
      ) : (
        <JoinName onLogin={props.onLogin} name={props.name} setName={props.setName}/>
      )}
    </div>
  );
};

export default Room;
