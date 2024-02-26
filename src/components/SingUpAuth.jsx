import { auth } from "../firebase.js";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

const SingUpAuth = async ({ username, email, pwd }) => {
  return await createUserWithEmailAndPassword(auth, email, pwd)
    .then(() => {
      return updateProfile(auth.currentUser, { displayName: username });
    })
    .then(() => {
      console.log("User signed up:", auth.currentUser);
      return false;
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

export default SingUpAuth;
