import { Routes, Route, Navigate } from "react-router-dom";
import MyPageLayout from "../mypage/layout/MyPageLayout";
import MyInfoPage from "../mypage/pages/info/MyInfoPage";
import MyPaymentPage from "../mypage/pages/payment/MyPaymentPage";
import MyReservationPage from "../mypage/pages/reservation/MyReservationPage";
import MySavedExpoPage from "../mypage/pages/saved-expo/MySavedExpoPage";
import MySettingPage from "../mypage/pages/setting/MySettingPage";
import AdsStatusPage from "../mypage/pages/ads-status/AdsStatusPage";
import ExpoStatusPage from "../mypage/pages/expo-status/ExpoStatusPage";

const MyPageRoutes = () => {
  return (
    <Routes>
      <Route path="/mypage" element={<MyPageLayout />}>
        {/* 기본 진입 시 myInfo로 리다이렉트 */}
        <Route index element={<Navigate to="info" replace />} />
        <Route path="info" element={<MyInfoPage />} />
        <Route path="payment" element={<MyPaymentPage />} />
        <Route path="reservation" element={<MyReservationPage />} />
        <Route path="saved-expo" element={<MySavedExpoPage />} />
        <Route path="setting" element={<MySettingPage />} />

        <Route path="ads-status" element={<AdsStatusPage />} />
        <Route path="expo-status" element={<ExpoStatusPage />} />
      </Route>
    </Routes>
  );
};

export default MyPageRoutes;
