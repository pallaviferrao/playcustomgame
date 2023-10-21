import React, { useEffect, useState } from "react";
import { RoomContext, SocketContext, UserContext } from "../App.js";
import { useNavigate } from "react-router-dom";
const Game = ({
  data,
  index,
  handleGameData,
  handleIndex,
  handleUserBoard,
}) => {
  console.log(data);
  let gameOver = data[0].gameData.length <= index ? "gameOver" : null;
  let gameQuestions = data[0].gameData[index]?.gameData?.questions;
  let gameType = data[0].gameData[index]?.gameData.gameType;
  const [user, setUser] = useState([]);
  useEffect(() => {
    console.log(gameType);
    if (gameType === "Vote") {
      const createOption = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([{ roomName: roomName }]),
      };
      fetch("https://customgame.onrender.com/userList", createOption)
        .then((response) => {
          return response.json();
        })
        .then((res) => {
          let arrKeys = Object.keys(res.userList);
          console.log(arrKeys);
          setUser(arrKeys);
          console.log("Voting Result", res);
        });
    }
  }, []);
  let navigate = useNavigate();

  let answer = gameQuestions?.length;
  let socket = React.useContext(SocketContext);
  let arr = new Array(answer);
  let userPoints = 0;
  const getPoints = (event) => {
    userPoints = event;
  };
  const AddAnswer = (num, event) => {
    arr[num] = event;
  };
  const roomName = React.useContext(RoomContext);
  const userName = React.useContext(UserContext);
  let roomNameVal = roomName;
  const votePerson = (name) => {
    let sc = 5;
    const createOption = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([{ vote: name, roomName: roomNameVal, score: sc }]),
    };
    fetch("https://customgame.onrender.com/votePerson", createOption)
      .then((response) => {
        return response.json();
      })
      .then((res) => {
        if (!res.waiting) {
          handleIndex(index + 1);
          handleUserBoard(res.leaderBoard);
          socket.emit("leaderboard", roomName, res.leaderBoard);
          navigate("/leaderBoard");
        }
      });
  };
  const addPoints = () => {
    const createOption = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([
        { userName: userName, roomName: roomName, points: userPoints },
      ]),
    };
    fetch("https://customgame.onrender.com/addPoints", createOption)
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
  const sumbitClick = () => {
    const createOption = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([
        { answers: arr, roomName: roomName, userName: userName, ind: index },
      ]),
    };
    fetch("https://customgame.onrender.com/submitQuiz", createOption)
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
      <div>This logged in user is {userName}</div>
      <div>{gameOver}</div>
      <div>
        {gameType && gameType === "Points" && (
          <div>
            <h3>What's your score?</h3>
            <input
              type="text"
              name="answer"
              onChange={(event) => {
                getPoints(event.target.value);
              }}
            />
            <button onClick={addPoints}>Add Points</button>
          </div>
        )}
      </div>
      <div>
        {gameType && gameType === "Quiz" && (
          <div>
            {gameQuestions.map((e, i) => {
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
        )}
      </div>
      <div>
        {user.map((namePerson, i) => {
          return (
            <div>
              <button onClick={(e) => votePerson(namePerson)}>
                Vote For this person : {namePerson}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Game;
