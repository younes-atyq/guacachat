import { useEffect } from "react";
import { Link } from "react-router-dom";

const Nav = ({ pageName }) => {
  useEffect(() => {
    document.querySelector(`[data-${pageName}]`)?.classList.add("active");
  }, [pageName]);
  return (
    <nav id="nav">
      <ul>
        <li>
          <Link data-home className="link" to={"/"}>
            Home
          </Link>
        </li>
        <li>
          <Link data-rooms className="link" to={"/rooms"}>
            Green Rooms
          </Link>
        </li>
        <li>
          <Link data-about className="link" to={"/about"}>
            About
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
