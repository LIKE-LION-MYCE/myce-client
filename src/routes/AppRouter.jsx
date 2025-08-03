import { BrowserRouter } from "react-router-dom";
import ExpoAdminRoutes from "./ExpoAdminRoutes";
import AuthPageRoutes from "./AuthPageRoutes";
import MyPageRoutes from "./MyPageRoutes";
import MainPageRoutes from './MainPageRoutes';

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
