import { Routes, Route } from "react-router-dom";
import ExpoApply from "../mainpage/pages/expoApply/ExpoApply";
import ExpoApply2 from "../mainpage/pages/expoApply/ExpoApply2";
import MainPageLayout from "../mainpage/layout/MainPageLayout";
import AdApply from "../mainpage/pages/adApply/AdApply";
import NonMemberReservationCheckPage from "../mainpage/pages/nonMemberReservation/NonMemberReservationCheckPage";
import ReservationDetailPage from "../mypage/components/reservationDetail/ReservationDetailPage";

function MainPageRoutes() {
  return (
    <Routes>
      <Route path="" element={<MainPageLayout />}>
        <Route path="expo-apply" element={<ExpoApply />} />
        <Route path="expo-apply2" element={<ExpoApply2 />} />
        <Route path="ad-apply" element={<AdApply />} />
        <Route path="non-member" element={<NonMemberReservationCheckPage />} />
        <Route
          path="/non-member/reservation/:id"
          element={<ReservationDetailPage />}
        />
      </Route>
    </Routes>
  );
}

export default MainPageRoutes;
