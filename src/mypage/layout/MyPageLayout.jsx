import React, { useCallback } from "react";
import { Outlet } from "react-router-dom";
import Header from "../../mainpage/layout/header/MainPageHeader";
import MyPageSidebar from "./sidebar/MyPageSidebar";
import styles from "./MyPageLayout.module.css";
import MainPageFooter from "../../mainpage/layout/footer/MainPageFooter";
import NotificationToast from '../../components/notification/NotificationToast';
import useRealtimeNotification from '../../hooks/useNotification';
import { NotificationProvider, useNotification } from '../../context/NotificationContext';
import { getNotifications } from '../../api/service/notification/notificationApi';

// 내부 컴포넌트: NotificationProvider 내부에서 실행되어야 함
const MyPageContent = () => {
  const { updateUnreadCount } = useNotification();

  // SSE 알림 수신 시 즉시 알림 목록 새로고침
  const handleNotificationReceived = useCallback(async () => {
    try {
      const notifications = await getNotifications();
      const unreadNotifications = notifications.filter(n => !n.isRead);
      updateUnreadCount(unreadNotifications.length);
      console.log('SSE 트리거: 알림 목록 새로고침 완료');
    } catch (error) {
      console.error('SSE 트리거: 알림 목록 새로고침 실패:', error);
    }
  }, [updateUnreadCount]);

  // 실시간 알림 훅 사용 (새로고침 콜백 전달)
  const { currentNotification, closeNotification } = useRealtimeNotification(handleNotificationReceived);

  return (
    <div className={styles.wrapper}>
      <Header />
      <div className={styles.content}>
        <MyPageSidebar />
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
      <MainPageFooter />

      {/* 실시간 알림 토스트 */}
      <NotificationToast
        notification={currentNotification}
        onClose={closeNotification}
      />
    </div>
  );
};

const MyPageLayout = () => {
  return (
    <NotificationProvider>
      <MyPageContent />
    </NotificationProvider>
  );
};

export default MyPageLayout;
