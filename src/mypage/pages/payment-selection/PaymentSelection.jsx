import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PaymentSelection.module.css';
import PaymentFinishedModal from '../../components/paymentDetailModal/PaymentFinishedModal';
import ExpoPaymentCompleted from '../../../mypage/components/paymentCompletedModal/ExpoPaymentCompleted';

// PaymentSelection 컴포넌트가 expoId를 prop으로 받도록 수정합니다.
const PaymentSelection = ({ paymentType = 'expo', expoId }) => {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [isPaymentCompleted, setIsPaymentCompleted] = useState(false);
  const navigate = useNavigate();

  const handleSelectPaymentMethod = (method) => {
    setSelectedMethod(method);
  };

  const handleContinuePayment = () => {
    if (selectedMethod) {
      setIsPaymentCompleted(true);
      console.log(`선택된 결제 수단: ${selectedMethod}`);
      
      // 결제 완료 후 페이지 이동 로직을 여기에 추가합니다.
      if (paymentType === 'ads') {
        // 광고 결제 완료 페이지로 이동 (PaymentFinishedModal은 모달이므로, 여기서는 페이지 이동은 하지 않습니다.)
        // 또는 특정 경로로 이동하도록 설정
        // navigate('/ads-payment-completed');
      } else {
        // 박람회 등록 결제 완료 페이지로 이동
        // ExpoPaymentCompleted는 컴포넌트이므로, 페이지 이동을 위한 별도 라우트가 필요
        // ExpoStatusDetail 페이지로 이동하도록 설정
        navigate(`/mypage/expo-status/${expoId}`);
      }
    }
  };

  if (isPaymentCompleted) {
    if (paymentType === 'ads') {
      return (
        <PaymentFinishedModal
          expoName="광고명"
          applicant="신청자명"
          period="2023.01.01 ~ 2023.01.31"
          amount="600,000원"
          totalAmount="600,000원"
          onClose={() => setIsPaymentCompleted(false)}
        />
      );
    } else {
      // ExpoPaymentCompleted 컴포넌트를 렌더링할 때 expoId prop을 전달합니다.
      return <ExpoPaymentCompleted expoId={expoId} />;
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>결제 수단 선택</h1>
      
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>신용카드</h2>
        <button
          className={`${styles.paymentButton} ${selectedMethod === 'creditCard' ? styles.selected : ''}`}
          onClick={() => handleSelectPaymentMethod('creditCard')}
        >
          <span className={styles.methodName}>신용카드</span>
          <span className={styles.logo}>토스페이로 결제</span>
        </button>
      </div>
      
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>기타 결제수단</h2>
        <button
          className={`${styles.paymentButton} ${selectedMethod === 'simplePay' ? styles.selected : ''}`}
          onClick={() => handleSelectPaymentMethod('simplePay')}
        >
          <span className={styles.methodName}>간편 결제</span>
        </button>
        <button
          className={`${styles.paymentButton} ${selectedMethod === 'bankTransfer' ? styles.selected : ''}`}
          onClick={() => handleSelectPaymentMethod('bankTransfer')}
        >
          <span className={styles.methodName}>계좌 이체</span>
        </button>
        <button
          className={`${styles.paymentButton} ${selectedMethod === 'overseasPayment' ? styles.selected : ''}`}
          onClick={() => handleSelectPaymentMethod('overseasPayment')}
        >
          <span className={styles.methodName}>해외 결제</span>
        </button>
      </div>

      <div className={styles.footer}>
        <button
          className={styles.continueButton}
          onClick={handleContinuePayment}
          disabled={!selectedMethod}
        >
          결제 계속하기
        </button>
      </div>
    </div>
  );
};

export default PaymentSelection;
