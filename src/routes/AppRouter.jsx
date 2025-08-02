import { BrowserRouter } from "react-router-dom";
import ExpoAdminRoutes from "./ExpoAdminRoutes";
import MainPageRoutes from "./MainPageRoutes";
import AuthPageRoutes from "./AuthPageRoutes";

function AppRouter() {
  return (
    <BrowserRouter>
      <ExpoAdminRoutes />
      <MainPageRoutes />
      <AuthPageRoutes />
    </BrowserRouter>
  );
}

export default AppRouter;
