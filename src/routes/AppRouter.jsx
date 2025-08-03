import { BrowserRouter } from "react-router-dom";
import ExpoAdminRoutes from "./ExpoAdminRoutes";
import AuthPageRoutes from "./AuthPageRoutes";
import MyPageRoutes from "./MyPageRoutes";
import MainPageRoutes from './MainPageRoutes';
import PlatformAdminRoutes from './PlatformAdminRoutes';

function AppRouter() {
  return (
    <BrowserRouter>
        <ExpoAdminRoutes />
        <PlatformAdminRoutes/>
        <MainPageRoutes />
        <AuthPageRoutes />
        <MyPageRoutes />
    </BrowserRouter>
  );
}

export default AppRouter;
