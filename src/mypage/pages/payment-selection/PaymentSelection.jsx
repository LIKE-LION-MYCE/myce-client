import React, { useState } from 'react';
import styles from './PaymentSelection.module.css';

const PaymentSelection = () => {
  // 상태 관리를 위해 선택된 결제 수단을 저장하는 useState 훅
  const [selectedMethod, setSelectedMethod] = useState('');

  const handleSelectPaymentMethod = (method) => {
    setSelectedMethod(method);
  };

  const handleContinuePayment = () => {
    if (selectedMethod) {
      console.log(`선택된 결제 수단: ${selectedMethod}`);
      // 실제 결제 로직을 여기에 구현하세요.
    } else {
      alert('결제 수단을 선택해주세요.');
    }
  };

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
