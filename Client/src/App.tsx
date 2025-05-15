import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";

import LoginSignup from "./Components/LoginSignup/LoginSignup";
import Account from "./Components/Account/Account";
import Navbar from "./Components/Navigation/Navbar";
import { AuthProvider } from "./Context/AuthContext";

import "./App.css";

const AppRoutes: React.FC = () => {
  const location = useLocation();
  const isAuthenticated = !!sessionStorage.getItem("accessToken");
  const showNavbar =
    isAuthenticated && location.pathname.startsWith("/account");

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<LoginSignup />} />
        <Route path="/account" element={<Account />} />
        {/* <Route path="/account/security" element={<Security />} /> */}
        {/* <Route path="/email" element={<Email/>} /> */}
        {/* <Route path="/password" element={<Password />} /> */}
        {/* <Route path="/settings" element={<Settings />} /> */}
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
