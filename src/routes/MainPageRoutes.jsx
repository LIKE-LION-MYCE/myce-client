import { Routes, Route } from 'react-router-dom';
import ExpoApply from '../mainpage/pages/expoApply/ExpoApply';
import ExpoApply2 from '../mainpage/pages/expoApply/ExpoApply2';
import MainPageLayout from '../mainpage/layout/MainPageLayout';
import AdApply from '../mainpage/pages/adApply/AdApply';


function MainPageRoutes() {
  return (
      <Routes>
        <Route path="" element={<MainPageLayout/>}>
            <Route path="expo-apply" element={<ExpoApply />} />
            <Route path="expo-apply2" element={<ExpoApply2 />} />
            <Route path="ad-apply" element={<AdApply />} />
        </Route>
      </Routes>
  );
}

export default MainPageRoutes;
