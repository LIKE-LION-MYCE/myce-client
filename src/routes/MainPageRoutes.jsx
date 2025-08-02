import { Routes, Route } from 'react-router-dom';
import MainPageLayout from '../mainpage/layout/MainPageLayout'; // 경로는 상황에 따라 조정
import MainPage from '../mainpage/pages/MainPage'; // 경로는 상황에 따라 조정
import BrowseExpo from '../mainpage/pages/BrowseExpo'; // 경로는 상황에 따라 조정
import ExpoDetail from '../mainpage/pages/ExpoDetail';
import ReviewForm from '../mainpage/pages/ReviewForm';

function MainPageRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainPageLayout />}>
        <Route index element={<MainPage />} />
        <Route path="browse" element={<BrowseExpo />} />
        <Route path="detail/:expoId" element={<ExpoDetail />} />
        <Route path="detail/:expoId/write-review" element={<ReviewForm />} />
      </Route>
    </Routes>
  );
}

export default MainPageRoutes;
