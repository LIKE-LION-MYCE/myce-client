import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../../mainpage/layout/header/MainPageHeader";
import MyPageSidebar from "./sidebar/MyPageSidebar";
import styles from "./MyPageLayout.module.css";
import Footer from "../../mainpage/layout/footer/MainPageFooter";
import NotificationToast from '../../components/notification/NotificationToast';
import useRealtimeNotification from '../../hooks/useNotification';
import { NotificationProvider } from '../../context/NotificationContext';

const MyPageLayout = () => {
  // 실시간 알림 훅 사용
  const { currentNotification, closeNotification } = useRealtimeNotification();

  return (
    <NotificationProvider>
      <div className={styles.wrapper}>
        <Header />
        <div className={styles.content}>
          <MyPageSidebar />
          <main className={styles.main}>
            <Outlet />
          </main>
        </div>
        <Footer />
        
        {/* 실시간 알림 토스트 */}
        <NotificationToast 
          notification={currentNotification} 
          onClose={closeNotification} 
        />
      </div>
    </NotificationProvider>
  );
};

export default MyPageLayout;
