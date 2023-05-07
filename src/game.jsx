import { useState, useEffect, useRef } from "react";
import { auth, db } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import "./game.css";
import Navbar from "./navbar";
import img from "./p.jpg";

export default function Game({ board, reset, getBoard }) {
  // const [board, setBoard] = useState(givenboard);
  const [player, setPlayer] = useState([0, 0]);
  const docId = useRef("");
  const joining = useRef(false);
  const creating = useRef(false);
  const [allPlayers, setAllPlayers] = useState([]);
  const [roomCollection, setroomcollection] = useState(null);
  const boarId = useRef("");
  const repeat = useRef(false);
  

  const createroom = (roomName) => {
    setroomcollection(collection(db, roomName));
    creating.current = true;
  };

  const joinroom = (roomName) => {
    setroomcollection(collection(db, roomName));
    joining.current = true;
  };

  async function getPlayers() {
    if (roomCollection === null) return;
    const playerCollection = await getDocs(roomCollection);
    const updatedcoordinates = [];
    playerCollection.forEach((doc) => {
      updatedcoordinates.push({ id: doc.id, ...doc.data() });
    });
    setAllPlayers(updatedcoordinates);
  }

  async function addBoard() {
    if (creating.current === false) return;
    try {
      const boardRef = collection(db, roomCollection.id + "board");
      if (boarId.current === "") {
        const boarddoc = await addDoc(boardRef, { board: board.flat() });
        boarId.current = boarddoc.id;
      } else {
        await updateDoc(doc(boardRef, boarId.current), {
          board: board.flat(),
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  if (repeat.current === true) {
    repeat.current = false;
    addBoard();
  }

  console.log("render1");

  useEffect(() => {
    if (roomCollection === null) return;

    const unsub = onSnapshot(roomCollection, (snapshot) => {
      const updatedcoordinates = [];
      snapshot.forEach((doc) => {
        updatedcoordinates.push({ id: doc.id, ...doc.data() });
      });
      setAllPlayers(updatedcoordinates);
    });

    async function addplayer() {
      try {
        const docRef = await addDoc(roomCollection, {
          player: player,
          user: auth.currentUser.photoURL,
        });
        docId.current = docRef.id;
      } catch (err) {
        console.log(err);
      }
    }

    if (joining.current === true) {
      // getBoard(roomCollection);
      getBoard(roomCollection);
    }

    async function addandget() {
      await addBoard();
      await addplayer();
      await getPlayers();
    }
    addandget();

    return unsub;
  }, [roomCollection]);

  useEffect(() => {
    if (roomCollection === null) return;
    async function updateplayer() {
      if (docId.current === "") return;
      try {
        await updateDoc(doc(roomCollection, docId.current), {
          player: player,
        });
      } catch (err) {
        console.log(err);
      }
    }
    async function updateandget() {
      try {
        await updateplayer();
        await getPlayers();
      } catch (err) {
        console.log(err);
      }
    }
    updateandget();
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
    repeat.current = true;
    setPlayer([0, 0]);
    reset();
  }
  return (
    <>
      <Navbar
        online={(exp) => setOnline(exp)}
        createroom={(name) => createroom(name)}
        joinroom={(name) => joinroom(name)}
      />
      <div className="game">
        <div className="maze">
          {board &&
            board.map((row, i) => (
              <div className="row" key={i}>
                {row.map((cell, j) => (
                  //add final classname to the end cell
                  <div
                    className={`cell ${!cell.top ? "top" : ""} ${
                      !cell.bottom ? "bottom" : ""
                    } ${!cell.left ? "left" : ""} ${
                      !cell.right ? "right" : ""
                    } ${
                      i === board.length - 1 && j === row.length - 1
                        ? "end"
                        : ""
                    }`}
                    key={j + i}
                  >
                    {player[0] === i && player[1] === j && (
                      <div className="player">
                        <img src={auth?.currentUser?.photoURL || img} alt="" />
                      </div>
                    )}

                    {docId.current !== "" &&
                      allPlayers.length > 0 &&
                      allPlayers.map((all, index) => {
                        if (
                          all.id !== docId.current &&
                          all.player[0] === i &&
                          all.player[1] === j
                        ) {
                          return (
                            <div className="player" key={index}>
                              <img src={all.user} alt="" />
                            </div>
                          );
                        }
                      })}
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
