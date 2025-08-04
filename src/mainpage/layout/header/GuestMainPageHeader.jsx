import React from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 임포트
import styles from './GuestMainPageHeader.module.css';

const GuestMainPageHeader = () => {
  const navigate = useNavigate(); // useNavigate 훅 사용

  const goToHome = () => {
    console.log('홈으로 이동');
    navigate('/'); // 홈페이지로 이동
  };

  const goToLogin = () => {
    console.log('로그인 페이지로 이동');
    navigate('/login'); // 로그인 페이지로 이동
  };

  const goToJoin = () => {
    console.log('회원가입 페이지로 이동');
    navigate('/signUp'); // 회원가입 페이지로 이동
  };

  const goToStudy = () => {
    console.log('예매 확인 페이지로 이동');
    navigate('/non-member'); // 예매 확인 페이지로 이동
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logoSection}>
        <div className={styles.logo} onClick={goToHome}>
          <img src="/myce_logo.png" alt="MYCE" className={styles.logoImage} />
        </div>
      </div>

      <div className={styles.rightSection}>
        <button className={`${styles.authBtn} ${styles.loginBtn}`} onClick={goToLogin}>
          로그인
        </button>
        <button className={`${styles.authBtn} ${styles.joinBtn}`} onClick={goToJoin}>
          회원가입
        </button>
        <button className={`${styles.authBtn} ${styles.studyBtn}`} onClick={goToStudy}>
          예매 확인
        </button>
      </div>
    </nav>
  );
};

export default GuestMainPageHeader;
