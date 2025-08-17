import { useMatch } from "react-router-dom";
import ExpoAdminRoutes from "./ExpoAdminRoutes";
import AuthPageRoutes from "./AuthPageRoutes";
import MyPageRoutes from "./MyPageRoutes";
import MainPageRoutes from './MainPageRoutes';
import PlatformAdminRoutes from './PlatformAdminRoutes';

function AppRouteBody() {

  const matchExpoAdmin = useMatch("/expos/:expoId/admin/*");

  return (
    <> 
      {matchExpoAdmin ? <ExpoAdminRoutes /> : null}
      <PlatformAdminRoutes/>
      <MainPageRoutes />
      <AuthPageRoutes />
      <MyPageRoutes />
    </>
  );
}

export default AppRouteBody;
