import React, { useState } from "react";
import { useParams, useLocation, useHistory } from "react-router-dom";

const JoinName = ({ onLogin, name, setName }) => {
  
  const [isLoading, setLoading] = useState(false);
  const { roomId } = useParams();
  const {pathname} = useLocation();
  const history = useHistory()
  
  const onEnter = async () => {
    const userData = {
      roomId,
      userName: name,
    };
    setLoading(true);
    onLogin(userData);
    if (pathname === '/') {
      history.push('/room')
    }
  };

  return (
    <div className="join-block">
      <input
        type="text"
        placeholder="Nickname"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button
        disabled={isLoading || !name}
        onClick={onEnter}
        className="btn"
      >
        {isLoading ? "Await..." : "Next"}
      </button>
    </div>
  );
};

export default JoinName;
