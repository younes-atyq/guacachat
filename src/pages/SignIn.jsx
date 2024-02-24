import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Popup from "../components/Popup";
import SignInPopupError from "./SingInPopupError";

function SignIn() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const signInForm = useRef();
  useEffect(() => {
    signInForm.current.addEventListener("submit", (e) => {
      e.preventDefault();
      const isValid = SignInPopupError({ email, pwd });
      console.log(isValid);
    });
  }, [email, pwd]);

  return (
    <div id="sign-in" className="container">
      <Popup />
      <h2 className="title">Sign In</h2>
      <form ref={signInForm} action="#">
        <label htmlFor="email">
          <span>Email:</span>{" "}
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            name="email"
            id="email"
          />
        </label>
        <label htmlFor="password">
          <span>Password:</span>
          <input
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            type="password"
            name="password"
            id="password"
          />
        </label>
        <input type="submit" value="Sign In" />
      </form>
      <p className="auth-info">
        Don't have an account?{" "}
        <Link className="auth-link" to={"/sign-up"}>
          Sign Up
        </Link>
      </p>
    </div>
  );
}

export default SignIn;
