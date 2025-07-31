import { BrowserRouter } from 'react-router-dom';
import ExpoAdminRoutes from './ExpoAdminRoutes';

function AppRouter() {
  return (
    <BrowserRouter>
        <ExpoAdminRoutes />
    </BrowserRouter>
  );
}

export default AppRouter;