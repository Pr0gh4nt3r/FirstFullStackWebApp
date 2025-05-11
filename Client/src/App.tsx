import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";

import LoginSignup from "./Components/LoginSignup/LoginSignup";
import Profile from "./Components/Profile/Profile";
import Navbar from "./Components/Navigation/Navbar";
import { AuthProvider } from "./Context/AuthContext";

import "./App.css";

const AppRoutes: React.FC = () => {
  const location = useLocation();
  const isAuthenticated = !!sessionStorage.getItem("accessToken");
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
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </BrowserRouter>
);

export default App;
