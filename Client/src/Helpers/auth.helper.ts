import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

import { IUserDocument } from "../../../Server/src/Interfaces/user.interface";
import { ILoginResponse } from "../Interfaces/loginResponse.interface.ts";
import { IDecodedToken } from "../Interfaces/token.interface";

const authURL = process.env.REACT_APP_API_BASE_URL_AUTH;
const dataURL = process.env.REACT_APP_API_BASE_URL_DATA;

export const login = async (form: IUserDocument, rememberMe: boolean) => {
  try {
    const response = await fetch(`${authURL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ form, rememberMe }),
    });

    const data = await response.json();

    if (!response.ok)
      // Handle error
      throw new Error(data.message || "Ein Fehler ist aufgetreten");

    const loginData = data as ILoginResponse;
    localStorage.setItem("AccessToken", data.accessToken);

    // Nur setzen, wenn "Eingeloggt bleiben" aktiviert ist
    if (rememberMe && data.refreshToken) {
      localStorage.setItem("RefreshToken", data.refreshToken);
    }

    // Erfolgsmeldung mit Toast
    toast.success("Erfolgreich eingeloggt!", { position: "top-right" });

    return loginData;
  } catch (error: any) {
    toast.error(error || "Ein Fehler ist aufgetreten.", {
      position: "top-right",
    });
  }
};

export const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem("RefreshToken");
    if (!refreshToken) throw new Error("Refresh token not found");

    const response = await fetch(`${authURL}/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();

    if (!response.ok)
      // Handle error
      throw new Error(data.message || "Ein Fehler ist aufgetreten");

    localStorage.setItem("AccessToken", data.accessToken);

    const decoded = jwtDecode(data.accessToken) as IDecodedToken;
    return { userId: decoded.id, accessToken: data.accessToken };
  } catch (error: any) {
    localStorage.removeItem("AccessToken");
    localStorage.removeItem("RefreshToken");
    toast.error(error || "Ein Fehler ist aufgetreten.", {
      position: "top-right",
    });
  }
};

export const logout = async () => {
  const refreshToken = localStorage.getItem("RefreshToken");

  if (!refreshToken) {
    localStorage.removeItem("AccessToken");
    return;
  }

  // Optional: Call your API to delete the refresh token
  try {
    const response = await fetch(`${authURL}/logout`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
      },
      body: JSON.stringify({
        refreshToken: localStorage.getItem("RefreshToken"),
      }),
    });

    if (!response.ok) throw new Error("Fehler beim Abmelden");
  } catch (error: any) {
    toast.error(error || "Fehler beim Abmelden", { position: "top-right" });
  }

  localStorage.removeItem("AccessToken");
  localStorage.removeItem("RefreshToken");
};

export const signup = async (form: IUserDocument) => {
  try {
    const response = await fetch(`${dataURL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();

    if (!response.ok)
      // Handle error
      throw new Error(data.message || "Ein Fehler ist aufgetreten");

    // Erfolgsmeldung mit Toast
    toast.success("Registrierung erfolgreich!", { position: "top-right" });
    return true;
  } catch (error: any) {
    toast.error(error || "Ein Fehler ist aufgetreten.", {
      position: "top-right",
    });
  }
};
