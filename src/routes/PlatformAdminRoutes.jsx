import { Routes, Route } from 'react-router-dom';
import PlatformAdminLayout from '../platform-admin/layout/PlatformAdminLayout';
import PlatformDashboard from '../platform-admin/pages/platformDashboard/platformDashboard';
import SettlementHistory from '../platform-admin/pages/settlementHistory/SettlementHistory';
import PlatformInquiry from '../platform-admin/pages/platformInquiry/PlatformInquiry';
import RoleAdmins from '../platform-admin/pages/roleAdmins/RoleAdmins';
import RoleUsers from '../platform-admin/pages/roleUsers/RoleUsers';
import ExpoApplications from '../platform-admin/pages/expoApplications/ExpoApplications';
import ExpoApplicationDetail from '../platform-admin/pages/expoApplicationsDetail/ExpoApplicationDetail';
import ExpoCurrent from '../platform-admin/pages/expoCurrent/ExpoCurrent';
import ExpoCurrentDetail from '../platform-admin/pages/expoCurrentDetail/ExpoCurrentDetail';
import BannerApplications from '../platform-admin/pages/bannerApplications/BannerApplications';
import BannerApplicationsDetail from '../platform-admin/pages/bannerApplicationsDetail/BannerApplicationsDetail';
import BannerCurrent from '../platform-admin/pages/bannerCurrent/BannerCurrent';
import BannerCurrentDetail from '../platform-admin/pages/bannerCurrentDetail/BannerCurrentDetail';


function PlatformAdminRoutes() {
  return (
      <Routes>
        <Route path="/platform/admin" element={<PlatformAdminLayout />}>
            <Route index element={<PlatformDashboard/>}/>
            <Route path="settlementHistory" element={<SettlementHistory/>}/>
            <Route path="inquiry" element={<PlatformInquiry/>}/>
            <Route path="roleAdmins" element={<RoleAdmins/>}/>
            <Route path="roleUsers" element={<RoleUsers/>}/>
            <Route path="expoApplications" element={<ExpoApplications/>}/>
            <Route path="expoApplications/:id" element={<ExpoApplicationDetail />} />
            <Route path="expoCurrent" element={<ExpoCurrent />} />
            <Route path="expoCurrent/:id" element={<ExpoCurrentDetail />} />
            <Route path="bannerApplications" element={<BannerApplications/>} />
            <Route path="bannerApplications/:id" element={<BannerApplicationsDetail />} />
            <Route path="bannerCurrent" element={<BannerCurrent />} />
            <Route path="bannerCurrent/:id" element={<BannerCurrentDetail />} />
        </Route>
      </Routes>
  );s
}

export default PlatformAdminRoutes;
