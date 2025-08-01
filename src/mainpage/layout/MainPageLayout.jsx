// src/mainpage/layout/MainPageLayout.jsx
import React from 'react';
import { Outlet } from "react-router-dom";
import styles from './MainPageLayout.module.css';
import MainPageHeader from './header/MainPageHeader'; // MainPageHeader 컴포넌트 import
import MainPageFooter from './footer/MainPageFooter'; // MainPageFooter 컴포넌트 import

function MainPageLayout() {
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
    </div>
  );
}

export default MainPageLayout;