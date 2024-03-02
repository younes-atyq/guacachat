import { doc, setDoc } from "firebase/firestore/lite";
import { auth, db } from "../firebase.js";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

const singUpAuth = async ({ username, email, pwd }) => {
  return await createUserWithEmailAndPassword(auth, email, pwd)
    .then(() => {
      updateProfile(auth.currentUser, { displayName: username }).then(() => {
        setDoc(doc(db, "users", auth.currentUser.uid), {
          username: username,
          email: email,
          uid: auth.currentUser.uid,
        }).then(() => {
          return false;
        });
      });
    })
    .catch((error) => {
      let errorMessage = "";
      console.log(error.code);
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Email already in use";
      } else {
        errorMessage = "An error occurred. Please try again.";
      }
      return errorMessage;
    });
};

export default singUpAuth;
