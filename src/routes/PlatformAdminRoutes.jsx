import { Routes, Route } from 'react-router-dom';
import PlatformAdminLayout from '../platform-admin/layout/PlatformAdminLayout';
import PlatformDashboard from '../platform-admin/pages/platformDashboard/PlatformDashboard';

function PlatformAdminRoutes() {
  return (
      <Routes>
        <Route path="/platform/admin" element={<PlatformAdminLayout />}>
            <Route index element={<PlatformDashboard/>}/>
        </Route>
      </Routes>
  );
}

export default PlatformAdminRoutes;
