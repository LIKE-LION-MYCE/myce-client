import { Routes, Route } from "react-router-dom";
import LoginPage from "../auth-page/pages/login/LoginPage";
import SignUpPage from "../auth-page/pages/signup/SignUpPage";
import FindIdPage from "../auth-page/pages/findId/FindIdPage";
import FindPasswordPage from "../auth-page/pages/findPassword/FindPasswordPage";
import OAuth2Success from "../auth-page/pages/oauth2/OAuth2Success";
import OAuth2Failure from "../auth-page/pages/oauth2/OAuth2Failure";

const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/findId" element={<FindIdPage />} />
      <Route path="/findPassword" element={<FindPasswordPage />} />
      <Route path="/oauth/success" element={<OAuth2Success />} />
      <Route path="/oauth/failure" element={<OAuth2Failure />} />
    </Routes>
  );
};

export default AuthRoutes;
