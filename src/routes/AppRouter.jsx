import { BrowserRouter } from "react-router-dom";
import ExpoAdminRoutes from "./ExpoAdminRoutes";
import MainPageRoutes from "./MainPageRoutes";
import AuthPageRoutes from "./AuthPageRoutes";
import MyPageRoutes from "./MyPageRoutes";

function AppRouter() {
  return (
    <BrowserRouter>
      <ExpoAdminRoutes />
      <MainPageRoutes />
      <AuthPageRoutes />
      <MyPageRoutes />
    </BrowserRouter>
  );
}

export default AppRouter;
