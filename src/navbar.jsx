import "./navbar.css";
import { auth, provider } from "./firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { useState, useEffect } from "react";

export default function Navbar({ online }) {
  const [issignin, setissignin] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setissignin(true);
        online(true);
      } else {
        setissignin(false);
        online(false);
      }
    });

    return unsubscribe;
  }, [online]);

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
  