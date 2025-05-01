import React from "react";
import { useNavigate } from "react-router-dom";
import logoutIcon from "../Assets/logout.png";
import "./Navbar.scss";

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("AccessToken");
    localStorage.removeItem("RefreshToken");
    // deleteRefreshToken(); // Optional: Call your API to delete the refresh token
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar__brand">MyApp</div>
      <button className="navbar__logout" onClick={handleLogout}>
        <img src={logoutIcon} alt="Logout" />
        <span>Logout</span>
      </button>
    </nav>
  );
};

export default Navbar;
