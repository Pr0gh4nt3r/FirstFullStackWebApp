import React, { useState } from "react";

import "./LoginSignup.scss";

import emailIcon from "../Assets/email.png";
import passwordIcon from "../Assets/passwort.png";
import userIcon from "../Assets/nutzer.png";

const LoginSignup: React.FC = () => {
  const [action, setAction] = useState<"signup" | "login">("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isLogin = action === "login";

  const handleSubmit = async (e: React.FormEvent) => {
    setError(null);
    e.preventDefault();

    try {
      setSubmitted(true);
      const response = await fetch(`http://localhost:5000/${action}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (response.ok) {
        // Handle successful login/signup
        console.log("Success:", data);
      } else {
        // Handle error
        setError(data.message || "An error occurred");
      }
    } catch (error) {
      setError("An error occurred while processing your request.");
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="text">{action}</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        {!isLogin && (
          <div className="input">
            <img src={userIcon} alt="" />
            <input placeholder="User Name" type="text" />
          </div>
        )}
        <div className="input">
          <img src={emailIcon} alt="" />
          <input placeholder="Email" type="email" />
        </div>
        <div className="input">
          <img src={passwordIcon} alt="" />
          <input placeholder="Password" type="password" />
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
          onClick={() => setAction(isLogin ? "signup" : "login")}
        >
          {isLogin ? "Sign Up" : "Login"}
        </span>
      </div>
      <div className="submit-container">
        {isLogin ? (
          <div className="submit">Login</div>
        ) : (
          <div className="submit">Sign Up</div>
        )}
      </div>
    </div>
  );
};

export default LoginSignup;
