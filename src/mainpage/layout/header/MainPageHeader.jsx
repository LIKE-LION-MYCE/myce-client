// src/mainpage/layout/header/MainPageHeader.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './MainPageHeader.module.css';

function MainPageHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link to="/">
            <img src="/myce_logo.png" alt="MYCE Logo" /> 
          </Link>
        </div>
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <Link to="/expo-list">박람회 목록</Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/expo-apply">박람회 등록</Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/ad-apply">광고 신청</Link>
            </li>
          </ul>
        </nav>
        <div className={styles.authButtons}>
          <button className={styles.loginButton}>로그인</button>
          <button className={styles.signupButton}>회원가입</button>
          <button className={styles.myPageButton}>마이페이지</button>
        </div>
      </div>
    </header>
  );
}

export default MainPageHeader;