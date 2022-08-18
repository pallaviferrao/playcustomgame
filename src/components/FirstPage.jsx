import React from "react";
import { RoomContext, SocketContext } from "../App.js";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../App.js";
const FirstPage = ({ handleGameData }) => {
  let navigate = useNavigate();
  const roomDetails = React.useContext(RoomContext);
  const socket = React.useContext(SocketContext);
  const admin = React.useContext(AdminContext);
  socket.on("sendM", (message) => {
    console.log(message);
    handleGameData(message);
    navigate("/game");
    console.log("After socket", message);
  });
  const start = () => {
    console.log("Roomdetails", roomDetails);
    const createOption = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([{ room: roomDetails }]),
    };
    fetch("https://apple-tart-39767.herokuapp.com/startGame2", createOption)
      .then((response) => {
        return response.json();
      })
      .then((res) => {
        console.log("After fetch", res.data);
        socket.emit("start-game", roomDetails, res.data);
      });
  };
  return (
    <div>
      {admin ? (
        <button onClick={start}>Start</button>
      ) : (
        <div>Waitng for Admin to start the game</div>
      )}
    </div>
  );
};
export default FirstPage;
