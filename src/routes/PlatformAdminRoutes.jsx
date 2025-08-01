import { Routes, Route } from 'react-router-dom';
import PlatformAdminLayout from '../platform-admin/layout/PlatformAdminLayout';
import PlatformDashboard from '../platform-admin/pages/platformDashboard/platformDashboard';
import SettlementHistory from '../platform-admin/pages/settlementHistory/SettlementHistory';
import PlatformInquiry from '../platform-admin/pages/platformInquiry/PlatformInquiry';

function PlatformAdminRoutes() {
  return (
      <Routes>
        <Route path="/platform/admin" element={<PlatformAdminLayout />}>
            <Route index element={<PlatformDashboard/>}/>
            <Route path="settlementHistory" element={<SettlementHistory/>}/>
            <Route path="inquiry" element={<PlatformInquiry/>}/>
        </Route>
      </Routes>
  );
}

export default PlatformAdminRoutes;
