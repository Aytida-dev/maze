import "./navbar.css";
import { auth, provider } from "./firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { useState, useEffect } from "react";

export default function Navbar({ createroom ,joinroom }) {
  const [issignin, setissignin] = useState(false);
  const [roomName, setroomName] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setissignin(true);
      } else {
        setissignin(false);
      }
    });

    return unsubscribe;
  }, []);

  const signin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.log(err);
    }
  };

  const signout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.log(err);
    }
  };

  const create_Room = () => {
    createroom(roomName);
    setroomName("");
  }

  const join_room = () => {
    joinroom(roomName);
    setroomName("");
  }

  return (
    <div className="navbar">
      <div className="navbar_title">Maze Runner</div>
      <div>
        {issignin && (
          <div className="user">
            <img
              src={auth.currentUser.photoURL}
              referrerPolicy="no-referrer"
              alt=""
            />
          </div>
        )}
        <button
          className="createRoom"
          disabled={roomName === ""}
          onClick={create_Room}
        >
          Create room
        </button>
        <input
          type="text"
          placeholder="Enter room name"
          value={roomName}
          onChange={(e) => setroomName(e.target.value)}
        />
        <button className="joinRoom" disabled={roomName===""} onClick={join_room}>Join room</button>
        <button className="sign" onClick={issignin ? signout : signin}>
          {issignin ? "Sign Out" : "Sign In"}
        </button>
      </div>
    </div>
  );
}
