import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { collection, getFirestore, orderBy, query } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// setup firebase
const firebaseConfig = {
  apiKey: "AIzaSyBc2-FoHMOGNRl2umgNeTmvjAN7aBh-FHE",
  authDomain: "guaca-chat.firebaseapp.com",
  projectId: "guaca-chat",
  storageBucket: "guaca-chat.appspot.com",
  messagingSenderId: "558750932690",
  appId: "1:558750932690:web:436a9462f855314ec9170b",
  measurementId: "G-1CF8W12284",
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Analytics
// export const analytics = getAnalytics(app);

// Initialize Authentication
export const auth = getAuth();

// Initialize Storage
export const storage = getStorage();

// Initialize firestore
export const db = getFirestore();

// rooms collection
export const colRooms = collection(db, "rooms");

// Queries the current room for messages
export const queryCurrentRoomMessages = (roomName) =>
  query(collection(db, "rooms", roomName, "messages"), orderBy("timestamp"));
