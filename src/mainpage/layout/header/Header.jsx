import React from 'react';
import styles from './Header.module.css';

export default function Header() {

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f410/emoji.svg" alt="MYCE 로고" className={styles.logo} />
        <span className={styles.brand}>MYCE</span>
      </div>
      <div className={styles.right}>
        <button className={styles.button}>박람회 목록</button>
        <button className={styles.button}>박람회 신청</button>
        <button className={styles.button}>광고 신청</button>
        <span className={styles.loginText}>로그인</span>
        <button className={styles.button}>회원가입</button>
        <button className={styles.button}>예매 확인</button>
      </div>
    </header>
  );
}
