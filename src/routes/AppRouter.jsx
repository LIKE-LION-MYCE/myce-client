import { BrowserRouter } from 'react-router-dom';
import ExpoAdminRoutes from './ExpoAdminRoutes';
import PlatformAdminRoutes from './PlatformAdminRoutes';

function AppRouter() {
  return (
    <BrowserRouter>
        <ExpoAdminRoutes />
        <PlatformAdminRoutes/>
    </BrowserRouter>
  );
}

export default AppRouter;