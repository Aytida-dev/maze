import { useEffect, useRef, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs , addDoc , onSnapshot} from "firebase/firestore";
import Game from "./game";
import "./game.css";

function App() {
  const [reset, setReset] = useState(false);
  const joining = useRef(false);
  const savedCollection = useRef(null);
  let newboard2d = useRef([]);
  let board = Array(25)
    .fill()
    .map((_, r) =>
      Array(25)
        .fill()
        .map((_, c) => ({
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          visited: false,
          r: r,
          c: c,
        }))
    );

  let current = board[0][0];
  current.visited = true;
  let stack = [];
  stack.push(current);

  function next(current) {
    const r = current.r;
    const c = current.c;

    let neighbors = [];

    if (r > 0 && !board[r - 1][c].visited) {
      neighbors.push(board[r - 1][c]);
    }
    if (r < board.length - 1 && !board[r + 1][c].visited) {
      neighbors.push(board[r + 1][c]);
    }
    if (c > 0 && !board[r][c - 1].visited) {
      neighbors.push(board[r][c - 1]);
    }
    if (c < board[0].length - 1 && !board[r][c + 1].visited) {
      neighbors.push(board[r][c + 1]);
    }
    return neighbors.length !== 0
      ? neighbors[Math.floor(Math.random() * neighbors.length)]
      : null;
  }

  function removeWall(current, next) {
    if (current.r === next.r) {
      if (current.c > next.c) {
        current.left = 1;
        next.right = 1;
      } else {
        current.right = 1;
        next.left = 1;
      }
    } else {
      if (current.r > next.r) {
        current.top = 1;
        next.bottom = 1;
      } else {
        current.bottom = 1;
        next.top = 1;
      }
    }
  }

  while (stack.length > 0) {
    const n = next(current);
    if (n) {
      removeWall(current, n);
      current = n;
      stack.push(current);
      current.visited = true;
    } else {
      current = stack.pop();
    }
  }

  async function getBoard(roomCollection) {
    joining.current = true;
    savedCollection.current = roomCollection
    try {
      //get last document from board collection
      const boardCollection = await getDocs(
        collection(db, `${roomCollection.id}board`)
      );
      const lastDoc = boardCollection.docs[boardCollection.docs.length - 1];
      //get board from last document
      const newboard = lastDoc.data().board;
      //change board from flat to 2d
      // newboard2d = [];
      console.log("getBoard");
      for (let i = 0; i < 25; i++) {
        newboard2d.current.push(newboard.slice(i * 25, i * 25 + 25));
      }
      
      setReset(!reset ? true : false);
      console.log("getBoard2");
      
      
    } catch (err) {
      console.log(err);
    }
    
  }

  async function addBoard(){
    
    try{
      const boardRef = collection(db, savedCollection.current.id+"board");
      await addDoc(boardRef, { board: board.flat() });
    }
    catch(err){
      console.log(err);
    }
  }

  useEffect(() => {
    if(!joining.current){
      return
    }
    const boardSnap = onSnapshot(collection(db,savedCollection.current.id+"board"), (doc) => {
      newboard2d.current = [];
      doc.forEach((doc) => {
        const newboard = doc.data().board;
        for (let i = 0; i < 25; i++) {
          newboard2d.current.push(newboard.slice(i * 25, i * 25 + 25));
        }
        console.log("onSnapshot2");
      })
      setReset(!reset ? true : false);
      console.log("onSnapshot");
    })

    return boardSnap;
  },[joining.current])

  console.log("render");

  function resetandgetBoard() {
    if(!joining.current){
      setReset(!reset ? true : false);
      return;
    }
    joining.current = false;
    newboard2d.current = [];
    addBoard();
    getBoard(savedCollection.current);
  }

  return (
    <div className="App">
      <Game
        board={joining.current? newboard2d.current : board}
        reset={() => resetandgetBoard()}
        getBoard={(roomCollection) => getBoard(roomCollection)}
      />
    </div>
  );
}

export default App;
