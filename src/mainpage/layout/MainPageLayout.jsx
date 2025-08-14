// src/mainpage/layout/MainPageLayout.jsx
import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from "react-router-dom";
import styles from './MainPageLayout.module.css';
import MainPageHeader from './header/MainPageHeader'; // MainPageHeader 컴포넌트 import
import MainPageFooter from './footer/MainPageFooter'; // MainPageFooter 컴포넌트 import
import FloatingChatButton from '../components/chatbutton/FloatingChatButton';

function MainPageLayout() {
  const location = useLocation();
  const [shouldOpenChat, setShouldOpenChat] = useState(false);

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
      <MainPageHeader />

      {/* 메인 콘텐츠 영역 - Outlet이 자식 라우트들을 렌더링합니다. */}
      <main className={styles.mainContent}>
        <Outlet />
      </main>

      {/* 푸터 */}
      <MainPageFooter />
      
      {/* Floating Chat Button - now handled at layout level */}
      <FloatingChatButton autoOpen={shouldOpenChat} />
    </div>
  );
}

export default MainPageLayout;
