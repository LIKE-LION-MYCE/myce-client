import { Routes, Route, Navigate } from "react-router-dom";
import MyPageLayout from "../mypage/layout/MyPageLayout";
import MyInfoPage from "../mypage/pages/info/MyInfoPage";
import MyReservationPage from "../mypage/pages/reservation/MyReservationPage";
import MySavedExpoPage from "../mypage/pages/saved-expo/MySavedExpoPage";
import MySettingPage from "../mypage/pages/setting/MySettingPage";
import SystemSettings from "../mypage/pages/systemSettings/SystemSettings";
import AdsStatusPage from "../mypage/pages/ads-status/AdsStatusPage";
import AdsStatusDetail from "../mypage/pages/adsStatusDetail/AdsStatusDetail";
import ExpoStatusPage from "../mypage/pages/expo-status/ExpoStatusPage";
import ExpoStatusDetail from "../mypage/pages/expoStatusDetail/ExpoStatusDetail";
import ReservationDetailPage from "../mypage/components/reservationDetail/ReservationDetailPage";
import PaymentSelection from "../mypage/pages/payment-selection/PaymentSelection";
import AdPaymentSelection from "../mypage/pages/payment-selection/AdPaymentSelection";

const MyPageRoutes = () => {
  return (
    <Routes>
      <Route path="/mypage" element={<MyPageLayout />}>
        {/* 기본 진입 시 myInfo로 리다이렉트 */}
        <Route index element={<Navigate to="info" replace />} />
        <Route path="info" element={<MyInfoPage />} />
        <Route path="reservation" element={<MyReservationPage />} />
        <Route path="reservation/:id" element={<ReservationDetailPage />} />
        <Route path="saved-expo" element={<MySavedExpoPage />} />
        <Route path="setting" element={<MySettingPage />} />
        <Route path="system-settings" element={<SystemSettings />} />
        <Route path="ads-status" element={<AdsStatusPage />} />
        <Route path="ads-status/:id" element={<AdsStatusDetail />} />
        <Route path="expo-status" element={<ExpoStatusPage />} />
        <Route path="expo-status/:id" element={<ExpoStatusDetail />} />
        <Route
          path="expo-status/:id/payment-selection"
          element={<PaymentSelection />}
        />
        <Route
          path="ads-status/:id/payment-selection"
          element={<AdPaymentSelection />}
        />
      </Route>
    </Routes>
  );
};

export default MyPageRoutes;
