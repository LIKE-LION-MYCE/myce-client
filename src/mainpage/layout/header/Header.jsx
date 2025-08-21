import React from 'react';
import styles from './Header.module.css';

export default function Header() {

  return (
    <header className={styles.header}>
      {/* 상단 줄 */}
      <div className={styles.topRow}>
        <div className={styles.topLeft}>
          <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f410/emoji.svg" alt="MYCE 로고" className={styles.logo} />
          <span className={styles.brand}>MYCE</span>
        </div>
        <div className={styles.searchContainer}>
          <input 
            type="text" 
            placeholder="박람회를 검색해보세요" 
            className={styles.searchInput}
          />
          <button className={styles.searchButton}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div className={styles.topRightLinks}>
          <span>MYCE</span>
          <span>|</span>
          <span>EXPO</span>
          <span>|</span>
          <span>Admin</span>
        </div>
      </div>
      
      {/* 하단 줄 */}
      <div className={styles.bottomRow}>
        <nav className={styles.navigation}>
          <button className={styles.navButton}>박람회 목록</button>
          <button className={styles.navButton}>박람회 신청</button>
          <button className={styles.navButton}>광고 신청</button>
        </nav>
        <div className={styles.rightActions}>
          <span className={styles.loginText}>로그인</span>
          <button className={styles.actionButton}>회원가입</button>
          <button className={styles.actionButton}>예매 확인</button>
        </div>
      </div>
    </header>
  );
}
