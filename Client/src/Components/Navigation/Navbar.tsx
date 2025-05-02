import React from "react";
import { useNavigate } from "react-router-dom";

import { logout } from "../../Helpers/auth.helper";
import logoutIcon from "../Assets/logout.png";

import "./Navbar.scss";

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
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
