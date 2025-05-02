// Profile.tsx
import React, { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { toast } from "react-toastify";

import { IUserDocument } from "../../../../Server/src/Interfaces/user.interface";

import "./Profile.scss";
import { getUserFromDB } from "../../Helpers/data.helper";

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
