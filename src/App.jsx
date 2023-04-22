import { useState } from "react";
import Game from "./game";
import "./game.css";

function App() {
  const[reset,setReset] = useState(false);
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

  return (
    <div className="App">
      <Game board={board} reset = {()=>setReset(!reset ? true : false)} />
    </div>
  );
}

export default App;
