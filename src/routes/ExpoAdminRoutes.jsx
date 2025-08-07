import { Routes, Route } from 'react-router-dom';
import ExpoAdminLayout from '../expo-admin/layout/ExpoAdminLayout';
import Dashboard from '../expo-admin/pages/dashboard/Dashboard';
import Payments from '../expo-admin/pages/payments/Payments';
import Reservations from '../expo-admin/pages/reservations/Reservations';
import Emails from '../expo-admin/pages/emails/Emails';
import Operation from '../expo-admin/pages/operation/Operation';
import Settlement from '../expo-admin/pages/settlement/Settlement';
import Settings from '../expo-admin/pages/setting/Setting';
import Booths from '../expo-admin/pages/booths/Booths';
import Events from '../expo-admin/pages/events/Events';
import Inquiry from '../expo-admin/pages/inquiry/Inquiry';

function ExpoAdminRoutes() {
  return (
      <Routes>
        <Route path="/expos/:expoId/admin" element={<ExpoAdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="setting" element={<Settings />} />
          <Route path="booths" element={<Booths/>}/>
          <Route path="events" element={<Events />} />
          <Route path="payments" element={<Payments/>} />
          <Route path="reservations" element={<Reservations />} />
          <Route path="emails" element={<Emails />} />
          <Route path="operation" element={<Operation />} />
          <Route path="settlement" element={<Settlement />} />
          <Route path="inquiry" element={<Inquiry />} />
        </Route>
      </Routes>
  );
}

export default ExpoAdminRoutes;