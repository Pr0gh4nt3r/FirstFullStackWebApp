// Profile.tsx
import React, { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { toast } from "react-toastify";

import Sidebar from "../Sidebar/Sidebar";
import { IUserDocument } from "../../../../Server/src/Interfaces/user.interface";
import { getUserFromDB } from "../../Helpers/data.helper";

import "./Profile.scss";

import { ReactComponent as UserIcon } from "../Assets/user.svg";
import { ReactComponent as EmailIcon } from "../Assets/email.svg";
import { ReactComponent as PasswordIcon } from "../Assets/password.svg";
import { ReactComponent as SettingsIcon } from "../Assets/settings.svg";
import { ReactComponent as RightIcon } from "../Assets/right.svg";

const Profile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<IUserDocument | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUserFromDB(id as string);
        setUser(user);
      } catch (err: any) {
        toast.error(err.message || "Es ist ein Fehler aufgetreten!", {
          position: "top-right",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) return <div className="loading">Loading...</div>;
  if (!user) return <Navigate to="/" />; // kein User? zurück zum Login

  const [local, domain] = user.email.split("@");
  const anonEmail = `${local.charAt(0)}•••@${domain}`;
  const memberSince = new Date(user.createdAt).toLocaleDateString("de-DE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return (
    <div className="profile-page">
      <Sidebar />
      <main className="profile-main">
        <h1 className="main-title">Konto</h1>
        <h2 className="subtitle">Details zum Konto</h2>
        <div className="card account-card">
          <div className="banner">Mitglied seit {memberSince}</div>
          <div className="account-info">
            <div className="info-item">
              <UserIcon className="icon" />
              <span>{user.userName}</span>
            </div>
            <div className="info-item">
              <EmailIcon className="icon" />
              <span>{anonEmail}</span>
            </div>
          </div>
        </div>

        <h2 className="subtitle">Schnellzugriff</h2>
        <div className="card shortcut-card">
          <ul>
            <li>
              <a href="/password">
                <span className="baseItem">
                  <span className="mainContent">
                    <span className="iconContainer">
                      <span className="iconWrapper">
                        <PasswordIcon className="icon" />
                      </span>
                    </span>
                    <span className="content">Passwort aktualisieren</span>
                  </span>
                  <span className="supplemental">
                    <RightIcon className="icon" />
                  </span>
                </span>
              </a>
            </li>
            <li>
              <a href="/settings">
                <span className="baseItem">
                  <span className="mainContent">
                    <span className="iconContainer">
                      <span className="iconWrapper">
                        <SettingsIcon className="icon" />
                      </span>
                    </span>
                    <span className="content">Einstellungen bearbeiten</span>
                  </span>
                  <span className="supplemental">
                    <RightIcon className="icon" />
                  </span>
                </span>
              </a>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Profile;
