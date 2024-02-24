import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Popup from "../components/Popup";
import SingUpPopupError from "../components/SingUpPopupError";

function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const signUpForm = useRef();
  useEffect(() => {
    signUpForm.current.addEventListener("submit", (e) => {
      e.preventDefault();
      const isValid = SingUpPopupError({ username, email, pwd, confirm });
      console.log(isValid);
    });
  }, [confirm, email, pwd, username]);

  // btn.addEventListener("click", () => {});

  return (
    <div id="sign-up" className="container">
      <Popup />
      <h2 className="title">Sign Up</h2>
      <form ref={signUpForm} action="#">
        <label htmlFor="username">
          <span>Username:</span>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            name="username"
            id="username"
          />
        </label>
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
        <label htmlFor="confirm">
          <span>Confirm Pwd:</span>
          <input
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            type="password"
            name="confirm"
            id="confirm"
          />
        </label>
        <input type="submit" value="Sign Up" />
      </form>
      <p className="auth-info">
        Already have an account?{" "}
        <Link className="auth-link" to={"/sign-in"}>
          Sign In
        </Link>
      </p>
    </div>
  );
}

export default SignUp;
