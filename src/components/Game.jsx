import React from "react";
import { RoomContext, SocketContext, UserContext } from "../App.js";
import { useNavigate } from "react-router-dom";
const Game = ({
  data,
  index,
  handleGameData,
  handleIndex,
  handleUserBoard,
}) => {
  let navigate = useNavigate();
  let gameData = data[0].gameData[index].gameData.questions;
  let answer = gameData.length;
  let socket = React.useContext(SocketContext);
  let arr = new Array(answer);
  const AddAnswer = (num, event) => {
    arr[num] = event;
  };
  const roomName = React.useContext(RoomContext);
  const userName = React.useContext(UserContext);
  const sumbitClick = () => {
    const createOption = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([
        { answers: arr, roomName: roomName, userName: userName, ind: index },
      ]),
    };
    fetch("http://localhost:5000/submitQuiz", createOption)
      .then((response) => {
        return response.json();
      })
      .then((res) => {
        if (!res.waiting) {
          handleIndex(index + 1);
          console.log(res);
          handleUserBoard(res.leaderBoard);
          socket.emit("leaderboard", roomName, res.leaderBoard);
          navigate("/leaderBoard");
        }
      });
  };
  return (
    <div>
      {gameData.map((e, i) => {
        return (
          <div>
            <div>{e.question}</div>
            <div className="upmargin">
              <label>
                Answer
                <input
                  type="text"
                  name="answer"
                  onChange={(event) => {
                    AddAnswer(i, event.target.value);
                  }}
                />
              </label>
            </div>
          </div>
        );
      })}
      <button onClick={sumbitClick}>Submit</button>
    </div>
  );
};
export default Game;
