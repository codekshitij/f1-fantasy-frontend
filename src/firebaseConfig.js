import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";

// Your Firebase Config (Replace with your own from Firebase Console)
const firebaseConfig = {
    apiKey: "AIzaSyCUwdJDu4LNSiyFxdFPsbUrS-_Yl-eStkY",
    authDomain: "f1-fantasy-league-dee25.firebaseapp.com",
    projectId: "f1-fantasy-league-dee25",
    storageBucket: "f1-fantasy-league-dee25.firebasestorage.app",
    messagingSenderId: "315191746571",
    appId: "1:315191746571:web:bf2dd952e76ea6d5d4a70e",
    measurementId: "G-DRB6MCKDFC"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };

