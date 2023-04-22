import "./navbar.css";
import { auth, provider } from "./firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { useState } from "react";

export default function Navbar() {
  const [issignin, setissignin] = useState(false);

  const signin = async () => {
    try {
      await signInWithPopup(auth, provider);
      setissignin(true);
    } catch (err) {
      console.log(err);
    }
  };

  const signout = async () => {
    try {
      await signOut(auth);
      setissignin(false);
    } catch (err) {
      console.log(err);
    }
  };
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
        <button className="sign" onClick={issignin ? signout : signin}>
          {issignin ? "Sign Out" : "Sign In"}
        </button>
      </div>
    </div>
  );
}
