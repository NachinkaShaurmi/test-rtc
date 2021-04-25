import React, {useState} from 'react';
import { useHistory } from "react-router-dom"

const JoinRoom = ({onLogin, name}) => {
  const [roomId, setRoom] = useState("");
  let history = useHistory()

  const onEnter = () => {
    const userData = {
      roomId,
      userName: name,
    };
    onLogin(userData);
    history.push(`/room/${roomId}`)
  }

  return (
    <div className="join-block">
      <input
        type="text"
        placeholder="Room ID"
        value={roomId}
        onChange={(e) => setRoom(e.target.value)}
      />
      <button
        disabled={!roomId}
        onClick={onEnter}
        className="btn"
      >
        Next
      </button>
    </div>
  )
}

export default JoinRoom
