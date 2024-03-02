import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PreventRefresh = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      navigate("/rooms");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [navigate]);

  return null; // or any component you want to render
};

export default PreventRefresh;
