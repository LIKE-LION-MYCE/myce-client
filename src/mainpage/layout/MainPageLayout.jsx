// src/mainpage/layout/MainPageLayout.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { Outlet, useLocation } from "react-router-dom";
import styles from './MainPageLayout.module.css';
import MainPageHeader from './header/MainPageHeader'; // MainPageHeader 컴포넌트 import
import MainPageFooter from './footer/MainPageFooter'; // MainPageFooter 컴포넌트 import
import FloatingChatButton from '../components/chatbutton/FloatingChatButton';
import { NotificationProvider } from '../../context/NotificationContext';
import NotificationToast from '../../components/notification/NotificationToast';
import useRealtimeNotification from '../../hooks/useNotification';
import { getNotifications } from '../../api/service/notification/notificationApi';
import { useNotification } from '../../context/NotificationContext';

// 내부 컴포넌트: NotificationProvider 내부에서 실행되어야 함
function MainPageContent() {
  const location = useLocation();
  const [shouldOpenChat, setShouldOpenChat] = useState(false);
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

  // Check if we should auto-open chat (from /chat redirect)
  useEffect(() => {
    if (location.state?.openChat) {
      setShouldOpenChat(true);
      // Clear the state so it doesn't persist on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  return (
    <div className={styles.layout}>
      {/* 헤더 (네비게이션 바) */}
      <MainPageHeader
        notification={currentNotification}
      />

      {/* 메인 콘텐츠 영역 - Outlet이 자식 라우트들을 렌더링합니다. */}
      <main className={styles.mainContent}>
        <Outlet />
      </main>

      {/* 푸터 */}
      <MainPageFooter />

      {/* Floating Chat Button - now handled at layout level */}
      <FloatingChatButton autoOpen={shouldOpenChat} />

      {/* 실시간 알림 토스트 */}
      <NotificationToast
        notification={currentNotification}
        onClose={closeNotification}
      />
    </div>
  );
}

function MainPageLayout() {
  return (
    <NotificationProvider>
      <MainPageContent />
    </NotificationProvider>
  );
}

export default MainPageLayout;
