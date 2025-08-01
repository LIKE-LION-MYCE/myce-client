import { BrowserRouter } from 'react-router-dom';
import ExpoAdminRoutes from './ExpoAdminRoutes';
import MainPageRoutes from './MainPageRoutes';

function AppRouter() {
  return (
    <BrowserRouter>
         <ExpoAdminRoutes />
        <MainPageRoutes />
    </BrowserRouter>
  );
}

export default AppRouter;