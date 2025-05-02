import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import emailIcon from "../Assets/email.png";
import passwordIcon from "../Assets/passwort.png";
import userIcon from "../Assets/nutzer.png";
import { login, signup } from "../../Helpers/auth.helper";
import { IUserDocument } from "../../../../Server/src/Interfaces/user.interface";

import "./LoginSignup.scss";
import "react-toastify/dist/ReactToastify.css";

const LoginSignup: React.FC = () => {
  const [action, setAction] = useState<"signup" | "login">("login");
  const [form, setForm] = useState({ userName: "", email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(true);
  const navigate = useNavigate();
  const isLogin = action === "login";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      if (!form.email || !form.password) {
        toast.error("Bitte alle Felder ausfüllen", { position: "top-right" });
        return;
      }

      const loginData = await login(form as IUserDocument, rememberMe);

      if (!loginData) {
        toast.error("Login fehlgeschlagen", { position: "top-right" });
        return;
      }

      navigate(`/user/${loginData.user.id}`);
    } else {
      if (!form.email || !form.password || !form.userName) {
        toast.error("Bitte alle Felder ausfüllen", { position: "top-right" });
        return;
      }

      const registered = (await signup(form as IUserDocument)) || false;

      if (!registered) {
        toast.error("Registrierung fehlgeschlagen", { position: "top-right" });
        return;
      }

      // Redirect to login page after successful signup
      navigate("/");
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
        {isLogin && (
          <div className="checkbox-container">
            <input
              id="rememberMe"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="rememberMe">Eingeloggt bleiben</label>
          </div>
        )}
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
