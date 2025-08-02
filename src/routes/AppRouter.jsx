import { BrowserRouter } from 'react-router-dom';
import ExpoAdminRoutes from './ExpoAdminRoutes';
import MainPageRoutes from './MainPageRoutes';

function AppRouter() {
  return (
    <BrowserRouter>
        <MainPageRoutes />
        <ExpoAdminRoutes />
    </BrowserRouter>
  );
}

export default AppRouter;