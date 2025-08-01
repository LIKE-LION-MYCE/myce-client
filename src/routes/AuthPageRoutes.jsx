import { Routes, Route } from "react-router-dom";
import LoginPage from "../auth-page/pages/login/LoginPage";
import SignUpPage from "../auth-page/pages/signup/SignUpPage";
import FindIdPage from "../auth-page/pages/findId/FindIdPage";

const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/findId" element={<FindIdPage />} />
    </Routes>
  );
};

export default AuthRoutes;
