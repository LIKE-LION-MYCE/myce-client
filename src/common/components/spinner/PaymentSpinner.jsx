import styles from './PaymentSpinner.module.css';

const PaymentSpinner = () => {
  return (
    <div className={styles.overlay}>
      <div className={styles.spinnerContainer}>
        <div className={styles.spinner}></div>
        <p className={styles.message}>결제중입니다. 잠시만 기다려주세요.</p>
      </div>
    </div>
  );
};

export default PaymentSpinner;