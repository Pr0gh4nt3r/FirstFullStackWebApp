import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";

import LoginSignup from "./Components/LoginSignup/LoginSignup";
import Profile from "./Components/Profile/Profile";
import Navbar from "./Components/Navigation/Navbar";

import "./App.css";

const AppRoutes: React.FC = () => {
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem("AccessToken");
  const showNavbar = isAuthenticated && location.pathname.startsWith("/user");

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<LoginSignup />} />
        <Route path="/user/:id" element={<Profile />} />
      </Routes>
    </>
  );
};

const App: React.FC = () => (
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
);

export default App;
