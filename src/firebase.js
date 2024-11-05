import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { collection, getFirestore, orderBy, query } from "firebase/firestore";

// setup firebase
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
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
