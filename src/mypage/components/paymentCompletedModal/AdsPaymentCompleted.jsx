import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdsPaymentCompleted.module.css';

const AdsPaymentCompleted = () => {
  const navigate = useNavigate();

  const handleRedirectToMain = () => {
    navigate('/');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>광고 배너 등록 결제 완료</h1>
      
      <div className={styles.content}>
        <div className={styles.question}>문제가 있으신가요?</div>
        
        <div className={styles.contact}>
          <span className={styles.contactIcon}>💬</span>
          <a href="#" className={styles.contactLink}>담당자 문의</a>
        </div>
      </div>
      
      <button className={styles.redirectButton} onClick={handleRedirectToMain}>
        메인 페이지
      </button>
    </div>
  );
};

export default AdsPaymentCompleted;
