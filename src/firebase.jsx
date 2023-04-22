// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth,GoogleAuthProvider } from "firebase/auth";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDLpwbeqjVezDNIhhPuilZdgWCBXZ-WiSM",
  authDomain: "maze-d7dc4.firebaseapp.com",
  projectId: "maze-d7dc4",
  storageBucket: "maze-d7dc4.appspot.com",
  messagingSenderId: "242052348066",
  appId: "1:242052348066:web:6e5b0f3f6bc5aa0f4b7ffb",
  measurementId: "G-M3H5DDW5HH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

export const db = getFirestore(app);

// const analytics = getAnalytics(app);