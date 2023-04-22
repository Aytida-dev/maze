import { useState, useEffect, useRef } from "react";
import { db } from "./firebase";
import { collection, getDocs, addDoc , updateDoc , doc } from "firebase/firestore";
import "./game.css";
import Navbar from "./navbar";

export default function Game({ board, reset }) {
  const [player, setPlayer] = useState([0, 0]);
  const docId = useRef("");
  const [allPlayers, setAllPlayers] = useState([]);

  const playerCollectionRef = collection(db, "player");

  async function getPlayers() {
    const playerCollection = await getDocs(playerCollectionRef);
    const updatedcoordinates = [];
    playerCollection.forEach((doc) => {
      updatedcoordinates.push(doc.data().player);
    });
    setAllPlayers(updatedcoordinates);
  }

  // getPlayers();
  

  useEffect(() => {
    async function addplayer() {
      const docRef = await addDoc(playerCollectionRef, {
        player: player,
      });
      docId.current=docRef.id;
      // console.log("Document written with ID: ", docRef.id);
    }
    addplayer();
  }, []);

  useEffect(() => {
    async function updateplayer() {
      if(docId.current === "") return;
      const docRef = await updateDoc(doc(playerCollectionRef, docId.current), {
        player: player,
      });
      // console.log("Document written with ID: ", docRef.id);
    }

    updateplayer();
  }, [player]);

  function up() {
    if (player[0] > 0 && board[player[0]][player[1]].top) {
      setPlayer([player[0] - 1, player[1]]);
    }
  }
  function down() {
    if (player[0] < board.length - 1 && board[player[0]][player[1]].bottom) {
      setPlayer([player[0] + 1, player[1]]);
    }
  }
  function left() {
    if (player[1] > 0 && board[player[0]][player[1]].left) {
      setPlayer([player[0], player[1] - 1]);
    }
  }
  function right() {
    if (player[1] < board[0].length - 1 && board[player[0]][player[1]].right) {
      setPlayer([player[0], player[1] + 1]);
    }
  }

  // event listners for key press
  function handleKeyDown(e) {
    if (e.key === "ArrowUp" && !e.repeat) {
      up();
    }
    if (e.key === "ArrowDown" && !e.repeat) {
      down();
    }
    if (e.key === "ArrowLeft" && !e.repeat) {
      left();
    }
    if (e.key === "ArrowRight" && !e.repeat) {
      right();
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  function resetGame() {
    setPlayer([0, 0]);
    reset();
  }
  return (
    <>
      <Navbar />
      <div className="game">
        <div className="maze">
          {board.map((row, i) => (
            <div className="row" key={i}>
              {row.map((cell, j) => (
                //add final classname to the end cell
                <div
                  className={`cell ${!cell.top ? "top" : ""} ${
                    !cell.bottom ? "bottom" : ""
                  } ${!cell.left ? "left" : ""} ${!cell.right ? "right" : ""} ${
                    i === board.length - 1 && j === row.length - 1 ? "end" : ""
                  }`}
                  key={j + i}
                >
                  
                  {player[0] === i && player[1] === j && (
                    <div className="player"></div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="controls">
          <div className="updiv">
            <button className="up controller" onClick={() => up()}>
              up
            </button>
          </div>
          <div className="middiv">
            <button className="left controller" onClick={() => left()}>
              left
            </button>

            <button className="reset" onClick={() => resetGame()}>
              reset
            </button>
            <button className="right controller" onClick={() => right()}>
              right
            </button>
          </div>
          <div className="botdiv">
            <button className="down controller" onClick={() => down()}>
              down
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
