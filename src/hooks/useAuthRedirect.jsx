import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase.js";

const useAuthRedirect = () => {
  const navigate = useNavigate();

  return onAuthStateChanged(auth, (user) => {
    console.log(
      "a render happened |",
      user ? "user is signed in" : "user is signed out"
    );
    if (user) {
      return true;
    } else {
      navigate("/sign-in");
      return false;
    }
  });
};

export default useAuthRedirect;
