import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import emailIcon from "../Assets/email.png";
import passwordIcon from "../Assets/passwort.png";
import userIcon from "../Assets/nutzer.png";
import { ILoginResponse } from "../../Interfaces/loginResponse.interface.ts";

import "./LoginSignup.scss";
import "react-toastify/dist/ReactToastify.css";

const LoginSignup: React.FC = () => {
  const [action, setAction] = useState<"signup" | "login">("login");
  const [form, setForm] = useState({ userName: "", email: "", password: "" });
  const navigate = useNavigate();

  const loginUrl = process.env.REACT_APP_API_BASE_URL_AUTH;
  const signupUrl = process.env.REACT_APP_API_BASE_URL_DATA;
  const isLogin = action === "login";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const apiURL = isLogin ? loginUrl : signupUrl;
      const response = await fetch(`${apiURL}/${action}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle error
        toast.error(data.message || "Ein Fehler ist aufgetreten", {
          position: "top-right",
        });
      }

      const loginData = data as ILoginResponse;
      localStorage.setItem("AccessToken", data.accessToken);
      localStorage.setItem("RefreshToken", data.refreshToken);

      // Erfolgsmeldung mit Toast
      toast.success(
        isLogin ? "Erfolgreich eingeloggt!" : "Registrierung erfolgreich!",
        { position: "top-right" }
      );

      // Handle successful login/signup - e.g., redirect and/or show a success message
      navigate(`/user/${loginData.user.id}`);
    } catch (error) {
      toast.error("An error occurred while processing your request.", {
        position: "top-right",
      });
    }
  };

  return (
    <>
      <ToastContainer autoClose={5000} hideProgressBar={false} newestOnTop />
      <div className="container">
        <div className="header">
          <div className="text">{action}</div>
          <div className="underline"></div>
        </div>
        <div className="inputs">
          {!isLogin && (
            <div className="input">
              <img src={userIcon} alt="" />
              <input
                type="text"
                placeholder="User Name"
                value={form.userName}
                onChange={(e) => setForm({ ...form, userName: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSubmit(e);
                }}
              />
            </div>
          )}
          <div className="input">
            <img src={emailIcon} alt="" />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit(e);
              }}
            />
          </div>
          <div className="input">
            <img src={passwordIcon} alt="" />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit(e);
              }}
            />
          </div>
        </div>
        <div className="links">
          {isLogin && (
            <span
              className="left"
              onClick={() => {
                /* handle reset password */
              }}
            >
              Reset Password
            </span>
          )}
          <span
            className="right"
            onClick={() => {
              setAction(isLogin ? "signup" : "login");
            }}
          >
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </div>
        <div className="submit-container">
          <div className="submit" onClick={handleSubmit}>
            {isLogin ? "Login" : "Sign Up"}
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginSignup;
