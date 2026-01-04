import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout({ setToken }) {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("authToken");
    setToken(null);
    navigate("/login");
  }, [navigate, setToken]);

  return null;
}