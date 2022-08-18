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
  let gameQuestions = data[0].gameData[index].gameData?.questions;
  let gameType = data[0].gameData[index].gameData.gameType;
  const [user, setUser] = useState([]);
  useEffect(() => {
    console.log(gameType);
    if (gameType === "Vote") {
      const createOption = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([{ roomName: roomName }]),
      };
      fetch("https://apple-tart-39767.herokuapp.com/userList", createOption)
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

  const AddAnswer = (num, event) => {
    arr[num] = event;
  };
  const roomName = React.useContext(RoomContext);
  const userName = React.useContext(UserContext);
  const votePerson = (name) => {
    let sc = 5;
    const createOption = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([{ vote: name, roomName: roomName, score: sc }]),
    };
    fetch(
      "https://apple-tart-39767.herokuapp.com/votePerson",
      createOption
    ).then((res) => {
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
    fetch("https://apple-tart-39767.herokuapp.com/submitQuiz", createOption)
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
      <div>
        {gameType !== "Vote" && (
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
      <div>{user}</div>
      <div>
        {user.map((e, i) => {
          return (
            <div>
              <div>{e}Name</div>
              <button onClick={(e) => votePerson(e)}>
                Vote For this person
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Game;
