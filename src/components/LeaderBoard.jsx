import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  AdminContext,
  RoomContext,
  SocketContext,
  UserContext,
} from "../App.js";

const LeaderBoard = ({ index }) => {
  const admin = React.useContext(AdminContext);
  const socket = React.useContext(SocketContext);
  const room = React.useContext(RoomContext);

  const [users, setUser] = useState({});
  let name = users ? Object.keys(users) : null;
  let navigate = useNavigate();
  socket.on("next-game", (message) => {
    navigate("/game");
  });
  socket.on("client-leaderboard", (userBoard) => {
    console.log("leader", userBoard);
    setUser(userBoard);
  });
  const nextGame = () => {
    socket.emit("nextGame", room, index);
    // navigate("/game");
  };
  return (
    <div>
      {name?.map((n) => {
        return (
          <div>
            <div>{n}</div>
            <div>{users[n]}</div>
          </div>
        );
      })}
      {admin ? <button onClick={nextGame}>Submit</button> : null}
    </div>
  );
};
export default LeaderBoard;
