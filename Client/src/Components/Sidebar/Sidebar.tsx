// src/components/Sidebar.tsx
import React from "react";
import { NavLink } from "react-router-dom";

import "./Sidebar.scss";

import { ReactComponent as HomeIcon } from "../Assets/home.svg";
import { ReactComponent as SecurityIcon } from "../Assets/security.svg";

const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li>
            <NavLink
              to="/account"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <HomeIcon className="icon" />
              Übersicht
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/account/security"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <SecurityIcon className="icon" />
              Sicherheit
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
