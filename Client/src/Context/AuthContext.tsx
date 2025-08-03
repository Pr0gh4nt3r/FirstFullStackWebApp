import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import { IAuthContextType } from "@/Interfaces/authContext.interface";
import { IDecodedToken } from "@/Interfaces/token.interface";
import { refreshAccessToken } from "@/Helpers/auth.helper";

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
      const account = await refreshAccessToken();

      if (!accessToken) {
        setAccessToken(null);
        setUserId(null);
        return;
      }

      setAccessToken(account.accessToken);
      setUserId(account.userId);
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
      }
      // navigation logic
      if (accessToken) {
        if (location.pathname === "/") navigate("/account");
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
