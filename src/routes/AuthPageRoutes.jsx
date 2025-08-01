import { Routes, Route } from "react-router-dom";
import LoginPage from "../auth-page/pages/login/LoginPage";
import SignUpPage from "../auth-page/pages/signup/SignUpPage";

const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
    </Routes>
  );
};

export default AuthRoutes;
