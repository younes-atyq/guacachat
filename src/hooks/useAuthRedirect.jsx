import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase.js";

const useAuthRedirect = () => {
  const navigate = useNavigate();

  return onAuthStateChanged(auth, (user) => {
    console.log(user ? "user is signed in" : "user is signed out");
    // When sign up the username not showing up
    // temporary fix: redirect to home instead of rooms
    if (user) {
      return true;
    } else {
      navigate("/sign-in");
      return false;
    }
  });
};

export default useAuthRedirect;
