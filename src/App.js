import logo from "./logo.svg";
import "./App.css";
import Home from "./components/Home.jsx";
import FirstPage from "./components/FirstPage.jsx";
import Game from "./components/Game.jsx";
import React, { useState, createContext } from "react";
import { Routes, HashRouter as Router, Route } from "react-router-dom";
import { io } from "socket.io-client";
import LeaderBoard from "./components/LeaderBoard";
export const UserContext = createContext("");
export const RoomContext = createContext("");
export const SocketContext = createContext("");
export const AdminContext = createContext("");
function App() {
  const socket = io("https://apple-tart-39767.herokuapp.com");
  const [user, setUser] = useState("");
  const [room, setRoom] = useState("");
  const [data, setData] = useState({});
  const [index, setIndex] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [socketId, setSocketId] = useState(socket);
  const [leaders, setLeaders] = useState({});
  const handleSetRoom = (room) => {
    console.log("Calling room");
    setRoom(room);
  };
  const handleSetIsAdmin = (isAdmin) => {
    setIsAdmin(isAdmin);
  };
  const handleSetUser = (user) => {
    setUser(user);
  };
  const handleGameData = (data) => {
    setData(data);
  };
  const handleIndex = (ind) => {
    setIndex(ind);
  };
  const handleUserBoard = (users) => {
    setLeaders(users);
  };
  return (
    <div className="App">
      <UserContext.Provider value={user}>
        <RoomContext.Provider value={room}>
          <SocketContext.Provider value={socketId}>
            <AdminContext.Provider value={isAdmin}>
              <Router>
                <Routes>
                  <Route
                    path="/"
                    element={
                      <Home
                        handleSetRoom={handleSetRoom}
                        handleSetUser={handleSetUser}
                        handleSetIsAdmin={handleSetIsAdmin}
                      />
                    }
                  ></Route>
                  <Route
                    path="/firstPage"
                    element={<FirstPage handleGameData={handleGameData} />}
                  ></Route>
                  <Route
                    path="/leaderboard"
                    element={<LeaderBoard index={index} />}
                  ></Route>
                  <Route
                    path="/game"
                    element={
                      <Game
                        data={data}
                        index={index}
                        handleGameData={handleGameData}
                        handleIndex={handleIndex}
                        handleUserBoard={handleUserBoard}
                      />
                    }
                  ></Route>
                </Routes>
              </Router>
            </AdminContext.Provider>
          </SocketContext.Provider>
        </RoomContext.Provider>
      </UserContext.Provider>
    </div>
  );
}

export default App;
