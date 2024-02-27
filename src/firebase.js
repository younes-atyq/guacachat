import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { collection, getFirestore, orderBy, query } from "firebase/firestore";

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
export const app = initializeApp(firebaseConfig);

// Initialize Authentication
export const auth = getAuth();

// Initialize Storage
export const storage = getStorage();

// Initialize firestore
export const db = getFirestore();

// // set collection
// export const colRef = collection(db, "messages");
export const q = query(collection(db, "messages"), orderBy("timestamp"));
