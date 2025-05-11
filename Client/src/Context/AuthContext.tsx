import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import { IAuthContextType } from "../Interfaces/authContext.interface";
import { refreshAccessToken } from "../Helpers/auth.helper";
import { IDecodedToken } from "../Interfaces/token.interface";

const AuthContext = createContext<IAuthContextType>({
  accessToken: null,
  userId: null,
  refresh: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [accessToken, setAccessToken] = useState<string | null>(
    sessionStorage.getItem("accessToken")
  );
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const refresh = async () => {
    try {
      const user = await refreshAccessToken();

      if (!user) {
        setAccessToken(null);
        setUserId(null);
        return;
      }

      setAccessToken(user.accessToken);
      setUserId(user.userId);
    } catch (error: any) {
      sessionStorage.removeItem("accessToken");
      toast.error(error.message || "Ein Fehler ist aufgetreten.", {
        position: "top-right",
      });
    }
  };

  useEffect(() => {
    const init = async () => {
      if (accessToken) {
        try {
          const decoded = jwtDecode<IDecodedToken>(accessToken);
          if (Date.now() / 1000 < decoded.exp) {
            setUserId(decoded.id);
          } else {
            await refresh();
          }
        } catch {
          await refresh();
        }
      } else {
        await refresh();
      }
      // navigation logic
      if (accessToken) {
        const id =
          userId ||
          jwtDecode<IDecodedToken>(sessionStorage.getItem("accessToken") || "")
            .id;
        if (location.pathname === "/") navigate(`/user/${id}`);
      } else {
        if (location.pathname !== "/") navigate("/");
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ accessToken, userId, refresh }}>
      {children}
    </AuthContext.Provider>
  );
};
