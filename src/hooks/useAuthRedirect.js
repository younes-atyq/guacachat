import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { analytics, auth } from "../firebase.js";

const useAuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // console.log(
      //   "a render happened |",
      //   user ? "user is signed in" : "user is signed out"
      // );
      if (!user) {
        analytics("user_signed_out");
        navigate("/sign-in");
      }
    });

    return () => unsubscribe();
  }, [navigate]);
};

export default useAuthRedirect;
