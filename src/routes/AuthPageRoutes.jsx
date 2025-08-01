import { Routes, Route } from "react-router-dom";
import LoginPage from "../auth-page/pages/login/LoginPage";

const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
};

export default AuthRoutes;
