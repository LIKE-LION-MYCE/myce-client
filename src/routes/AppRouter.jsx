import { BrowserRouter } from "react-router-dom";
import ExpoAdminRoutes from "./ExpoAdminRoutes";
import AuthPageRoutes from "./AuthPageRoutes";

function AppRouter() {
  return (
    <BrowserRouter>
      <ExpoAdminRoutes />
      <AuthPageRoutes />
    </BrowserRouter>
  );
}

export default AppRouter;
