import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase.js";

const useAuthRedirect = () => {
  const navigate = useNavigate();

  onAuthStateChanged(auth, (user) => {
    console.log(user ? "user is signed in" : "user is signed out");
    if (user) {
      // navigate("/rooms");
    } else {
      navigate("/sign-in");
    }
  });
};

export default useAuthRedirect;
