import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RoomContext, SocketContext } from "../App.js";
const Home = ({ handleSetRoom, handleSetUser, handleSetIsAdmin }) => {
  const socket = React.useContext(SocketContext);
  let navigate = useNavigate();
  const [room, setRoom] = useState("");
  const [user, setUser] = useState("");
  const [socketId, setSocketId] = useState("");
  socket.on("room-joined", (message) => {
    console.log(message);

    navigate("/firstPage");
  });
  const roomName = (roomName) => {
    setRoom(roomName);
  };
  const userName = (userName) => {
    setUser(userName);
  };
  const submit = () => {
    const createOption = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([{ room: room, user: user }]),
    };
    fetch("https://apple-tart-39767.herokuapp.com/startGame1", createOption)
      .then((response) => response.json())
      .then((res1) => {
        handleSetRoom(room);
        handleSetUser(user);
        handleSetIsAdmin(res1.isAdmin);
        console.log(res1);
        socket.emit("join-room", room);
      });
  };
  return (
    <div>
      <div>
        <label>
          Room Name
          <input
            type="text"
            name="questions6"
            onChange={(event) => {
              roomName(event.target.value);
            }}
          />
        </label>
      </div>
      <div>
        <label>
          User Name
          <input
            type="text"
            name="questions6"
            onChange={(event) => {
              userName(event.target.value);
            }}
          />
        </label>
      </div>
      <div>
        <button
          onClick={() => {
            submit();
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
};
export default Home;
