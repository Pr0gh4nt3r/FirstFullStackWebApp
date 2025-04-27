import React from "react";

import "./LoginSignup.scss";

const LoginSignup: React.FC = () => {
  return (
    <div className="login-signup">
      <h1>Login or Signup</h1>
      <form>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit">Login</button>
        <button type="button">Signup</button>
      </form>
    </div>
  );
};

export default LoginSignup;
