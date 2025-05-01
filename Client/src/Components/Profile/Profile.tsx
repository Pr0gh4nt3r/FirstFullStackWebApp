// Profile.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { toast } from "react-toastify";

import { IUserDocument } from "../../../../Server/src/Interfaces/user.interface";

import "./Profile.scss";

const Profile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<IUserDocument | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("AccessToken");
      if (!token) {
        toast.error("Nicht authentifiziert", { position: "top-right" });
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`http://localhost:1338/user/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          throw new Error("Fehler beim Laden der User-Daten");
        }
        const data = await res.json();
        setUser(data);
      } catch (err: any) {
        toast.error(err.message, { position: "top-right" });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/" />; // kein User? zurück zum Login

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Willkommen, {user.userName}!</h1>
      </div>
      <div className="profile-details">
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        {/* Weitere Profil-Felder */}
      </div>
    </div>
  );
};

export default Profile;
