import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { logout } from "@/Helpers/auth.helper";

import "./Navbar.scss";

import { LogoutIcon } from "@/Components/Assets";

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      logout();
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Logout fehlgeschlagen", {
        position: "top-right",
      });
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar__brand">MyApp</div>
      <button className="navbar__logout" onClick={handleLogout}>
        <LogoutIcon className="navbar__icon" width={15} height={15} />
        <span>Ausloggen</span>
      </button>
    </nav>
  );
};

export default Navbar;
