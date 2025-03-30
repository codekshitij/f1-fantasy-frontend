import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

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
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
export const googleProvider = new GoogleAuthProvider(); 