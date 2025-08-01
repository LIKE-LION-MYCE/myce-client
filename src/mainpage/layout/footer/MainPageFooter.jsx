// src/mainpage/layout/footer/MainPageFooter.jsx
import React from 'react';
import styles from './MainPageFooter.module.css';

function MainPageFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerLinks}>
          <div className={styles.infoSection}>
            <h3 className={styles.infoTitle}>MYCE</h3>
            <p className={styles.infoText}>회사 도로명 주소 정보</p>
          </div>
          <div className={styles.linkSection}>
            <h4 className={styles.linkTitle}>서비스</h4>
            <ul className={styles.linkList}>
              <li><a href="#">박람회 예약</a></li>
              <li><a href="#">예약 조회</a></li>
              <li><a href="#">일대일 상담</a></li>
            </ul>
          </div>
          <div className={styles.linkSection}>
            <h4 className={styles.linkTitle}>비즈니스</h4>
            <ul className={styles.linkList}>
              <li><a href="#">박람회 신청</a></li>
              <li><a href="#">광고 신청</a></li>
            </ul>
          </div>
        </div>
        <div className={styles.copyright}>
          <p>© 2024 Myce. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default MainPageFooter;