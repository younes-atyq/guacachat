import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// setup firebase
const firebaseConfig = {
  apiKey: "AIzaSyBc2-FoHMOGNRl2umgNeTmvjAN7aBh-FHE",
  authDomain: "guaca-chat.firebaseapp.com",
  projectId: "guaca-chat",
  storageBucket: "guaca-chat.appspot.com",
  messagingSenderId: "558750932690",
  appId: "1:558750932690:web:436a9462f855314ec9170b",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication
export const auth = getAuth(app);
