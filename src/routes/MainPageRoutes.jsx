import { Routes, Route } from "react-router-dom";
import ExpoApply from "../mainpage/pages/expoApply/ExpoApply";
import ExpoApply2 from "../mainpage/pages/expoApply/ExpoApply2";
import MainPageLayout from "../mainpage/layout/MainPageLayout";
import MainPage from "../mainpage/pages/index/MainPage";
import BrowseExpo from "../mainpage/pages/expo-list/BrowseExpo";
import ExpoDetail from "../mainpage/pages/detail/ExpoDetail";
import ReviewForm from "../mainpage/pages/detail/reviewform/ReviewForm";
import AdApply from "../mainpage/pages/adApply/AdApply";
import ExpoPayment from "../mainpage/pages/payment/ExpoPayment";
import ReservationSuccess from "../mainpage/pages/reservationsuccess/ReservationSuccess";
import Chat from "../mainpage/pages/chat/Chat";
import NonMemberReservationCheckPage from "../mainpage/pages/nonMemberReservation/NonMemberReservationCheckPage";
import ReservationDetailPage from "../mypage/components/reservationDetail/ReservationDetailPage";

function MainPageRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainPageLayout />}>
        <Route index element={<MainPage />} />
        <Route path="expo-list" element={<BrowseExpo />} />
        <Route path="detail/:expoId" element={<ExpoDetail />} />
        <Route path="detail/:expoId/write-review" element={<ReviewForm />} />
        <Route path="detail/:expoId/payment" element={<ExpoPayment />} />
        <Route
          path="reservation-success/:reservationId"
          element={<ReservationSuccess />}
        />
        <Route path="expo-apply" element={<ExpoApply />} />
        <Route path="expo-apply2" element={<ExpoApply2 />} />
        <Route path="ad-apply" element={<AdApply />} />
        <Route path="chat" element={<Chat />} />
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
