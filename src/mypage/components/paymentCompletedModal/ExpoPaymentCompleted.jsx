import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ExpoPaymentCompleted.module.css';

// ExpoPaymentCompleted 컴포넌트가 동적인 expoId를 prop으로 받도록 수정합니다.
const ExpoPaymentCompleted = ({ expoId }) => {
  const navigate = useNavigate();

  const handleGoToDetailPage = () => {
    // 받은 expoId를 사용하여 동적인 경로로 이동합니다.
    navigate(`/mypage/expo-status/${expoId}`); 
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>박람회 등록 결제 완료</h1>
      
      <div className={styles.content}>
        <p className={styles.description}>아래는 관리자 코드입니다.</p>
        <p className={styles.notice}>분실하지 않도록 주의해주세요.</p>
        
        <div className={styles.codeSection}>
          <div className={styles.codeLabel}>관리자 번호</div>
          <div className={styles.codeValue}>ab12bc123A53</div>
        </div>
        
        <div className={styles.question}>문제가 있으신가요?</div>
        
        <div className={styles.contact}>
          <span className={styles.contactIcon}>💬</span>
          <a href="#" className={styles.contactLink}>담당자 문의</a>
        </div>
      </div>
      
      <button className={styles.redirectButton} onClick={handleGoToDetailPage}>
        박람회 상세 페이지로 이동
      </button>
    </div>
  );
};

export default ExpoPaymentCompleted;
