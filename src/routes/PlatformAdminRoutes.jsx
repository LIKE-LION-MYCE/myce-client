import { Routes, Route, Navigate } from 'react-router-dom';
import PlatformAdminLayout from '../platform-admin/layout/PlatformAdminLayout';
import SettlementHistory from '../platform-admin/pages/settlementHistory/SettlementHistory';
import PlatformInquiry from '../platform-admin/pages/platformInquiry/PlatformInquiry';
import RoleUsers from '../platform-admin/pages/roleUsers/RoleUsers';
import ExpoApplications from '../platform-admin/pages/expoApplications/ExpoApplications';
import ExpoApplicationDetail from '../platform-admin/pages/expoApplicationsDetail/ExpoApplicationDetail';
import ExpoCurrent from '../platform-admin/pages/expoCurrent/ExpoCurrent';
import ExpoCurrentDetail from '../platform-admin/pages/expoCurrentDetail/ExpoCurrentDetail';
import BannerApplications from '../platform-admin/pages/bannerApplications/BannerApplications';
import BannerApplicationsDetail from '../platform-admin/pages/bannerApplicationsDetail/BannerApplicationsDetail';
import BannerCurrent from '../platform-admin/pages/bannerCurrent/BannerCurrent';
import BannerCurrentDetail from '../platform-admin/pages/bannerCurrentDetail/BannerCurrentDetail';
import MessageTemplateList from '../platform-admin/pages/settingMessages/MessageTemplateList';
import MessageTemplateDetail from '../platform-admin/pages/settingMessagesDetail/MessageTemplateDetail';
import MessageTemplateEdit from '../platform-admin/pages/settingMessagesDetail/MessageTemplateEdit';
import AmountSettingList from '../platform-admin/pages/settingAmount/AmountSettingList';
import AmountSettingDetail from '../platform-admin/pages/settingAmountDetail/AmountSettingDetail';
import AdPositionList from '../platform-admin/pages/settingAdPosition/AdPositionList';
import AdPositionDetail from '../platform-admin/pages/settingAdPositionDetail/AdPositionDetail';
import AdPositionNew from '../platform-admin/pages/settingAdPositionDetail/AdPositionNew';
import RevenueDashboard from '../platform-admin/pages/platformDashboard/RevenueDashboard';
import UsageDashboard from '../platform-admin/pages/platformDashboard/UsageDashboard';

function PlatformAdminRoutes() {
  return (
    <Routes>
      <Route path="/platform/admin" element={<PlatformAdminLayout />}>
        <Route index element={<Navigate to="dashboard/revenue" replace />} />
        <Route path="dashboard/revenue" element={<RevenueDashboard />} />
        <Route path="dashboard/usage" element={<UsageDashboard />} />
        <Route path="settlementHistory" element={<SettlementHistory />} />
        <Route path="inquiry" element={<PlatformInquiry />} />
        <Route path="roleUsers" element={<RoleUsers />} />
        <Route path="expoApplications" element={<ExpoApplications />} />
        <Route path="expoApplications/:id" element={<ExpoApplicationDetail />} />
        <Route path="expoCurrent" element={<ExpoCurrent />} />
        <Route path="expoCurrent/:id" element={<ExpoCurrentDetail />} />
        <Route path="bannerApplications" element={<BannerApplications />} />
        <Route path="bannerApplications/:id" element={<BannerApplicationsDetail />} />
        <Route path="bannerCurrent" element={<BannerCurrent />} />
        <Route path="bannerCurrent/:id" element={<BannerCurrentDetail />} />
        <Route path="settingMessage" element={<MessageTemplateList />} />
        <Route path="settingMessage/:id" element={<MessageTemplateDetail />} />
        <Route path="settingMessage/:id/edit" element={<MessageTemplateEdit />} />
        <Route path="settingAmount" element={<AmountSettingList />} />
        <Route path="settingAmount/:name" element={<AmountSettingDetail />} />
        <Route path="adPosition" element={< AdPositionList />} />
        <Route path="adPosition/:id" element={<AdPositionDetail />} />
        <Route path="adPosition/new" element={<AdPositionNew />} />
      </Route>
    </Routes>
  );
}

export default PlatformAdminRoutes;
