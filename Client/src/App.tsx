import { BrowserRouter, Route, Routes } from "react-router-dom";

import LoginSignup from "./Components/LoginSignup/LoginSignup";
import Profile from "./Components/Profile/Profile";
import Navbar from "./Components/Navigation/Navbar";

import "./App.css";

function App() {
  const isAuthenticated = !!localStorage.getItem("Accesstoken") || "";

  return (
    <BrowserRouter>
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route path="/" element={<LoginSignup />} />
        <Route path="/user/:id" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
