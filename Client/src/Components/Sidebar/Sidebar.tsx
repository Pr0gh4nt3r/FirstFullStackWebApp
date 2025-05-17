// src/components/Sidebar.tsx
import React from "react";
import { NavLink } from "react-router-dom";

import "./Sidebar.scss";

import { HomeIcon, SecurityIcon } from "@/Components/Assets";

const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li>
            <NavLink
              to="/account"
              end
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <HomeIcon className="icon" />
              Übersicht
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/account/security"
              end
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
