import React from 'react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.column}>
          <h4 className={styles.title}>MYCE</h4>
          <p className={styles.text}>회사 도로명 주소 정보</p>
        </div>
        <div className={styles.column}>
          <h4 className={styles.title}>서비스</h4>
          <a href="#" className={styles.link}>박람회 예약</a>
          <a href="#" className={styles.link}>예약 조회</a>
          <a href="#" className={styles.link}>일대일 상담</a>
        </div>
        <div className={styles.column}>
          <h4 className={styles.title}>비즈니스</h4>
          <a href="#" className={styles.link}>박람회 신청</a>
          <a href="#" className={styles.link}>광고 신청</a>
        </div>
      </div>
      <div className={styles.copyright}>
        © 2024 Myce. All rights reserved.
      </div>
    </footer>
  );
}
