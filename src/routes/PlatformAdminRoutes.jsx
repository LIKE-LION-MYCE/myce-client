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
import MessageTemplateList from '../platform-admin/pages/settingMessages/MessageTemplateList';
import MessageTemplateDetail from '../platform-admin/pages/settingMessagesDetail/MessageTemplateDetail';
import MessageTemplateEdit from '../platform-admin/pages/settingMessagesDetail/MessageTemplateEdit';
import MessageTemplateNew from '../platform-admin/pages/settingMessagesDetail/MessageTemplateNew';
import AmountSettingList from '../platform-admin/pages/settingAmount/AmountSettingList';
import AmountSettingDetail from '../platform-admin/pages/settingAmountDetail/AmountSettingDetail';

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
            <Route path="settingMessage" element={<MessageTemplateList />} />
            <Route path="settingMessage/:id" element={<MessageTemplateDetail />} />
            <Route path="settingMessage/:id/edit" element={<MessageTemplateEdit />} />
            <Route path="settingMessage/new" element={<MessageTemplateNew />} />
            <Route path="settingAmount" element={<AmountSettingList />} />
            <Route path="settingAmount/:name" element={<AmountSettingDetail />} />
        </Route>
      </Routes>
  );s
}

export default PlatformAdminRoutes;
