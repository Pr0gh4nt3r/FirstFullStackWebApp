import { jwtDecode } from "jwt-decode";

import { IAccountDocument } from "../../../Server/src/Interfaces/account.interface";
import { ILoginResponse } from "@/Interfaces/loginResponse.interface.ts";
import { IDecodedToken } from "@/Interfaces/token.interface";

const authURL = process.env.REACT_APP_API_BASE_URL_AUTH;
const dataURL = process.env.REACT_APP_API_BASE_URL_DATA;

export const login = async (form: IAccountDocument, rememberMe: boolean) => {
  const response = await fetch(`${authURL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ form, rememberMe }),
  });

  const data = await response.json();

  if (!response.ok)
    throw new Error(data.message || "Ein Fehler ist aufgetreten");

  const loginData = data as ILoginResponse;

  sessionStorage.setItem("accessToken", loginData.accessToken);

  return loginData;
};

export const refreshAccessToken = async () => {
  const response = await fetch(`${authURL}/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok)
    throw new Error(data.message || "Ein Fehler ist aufgetreten");

  sessionStorage.setItem("accessToken", data.accessToken);

  const decoded = jwtDecode(data.accessToken) as IDecodedToken;
  return { userId: decoded.id, accessToken: data.accessToken };
};

export const logout = async () => {
  const token = sessionStorage.getItem("accessToken");

  if (!token) {
    throw new Error("Nicht authentifiziert");
  }

  // Call API to delete the refresh token
  const response = await fetch(`${authURL}/logout`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  if (!response.ok) throw new Error("Fehler beim Abmelden");

  sessionStorage.removeItem("accessToken");
};

export const signup = async (form: IAccountDocument) => {
  const response = await fetch(`${dataURL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  });

  const data = await response.json();

  if (!response.ok)
    throw new Error(data.message || "Ein Fehler ist aufgetreten");

  return true;
};
