import styles from './PaymentSpinner.module.css';
import LoadingSpinner from '../../../components/shared/LoadingSpinner/LoadingSpinner';

const PaymentSpinner = () => {
  return (
    <div className={styles.overlay}>
      <div className={styles.spinnerContainer}>
        <LoadingSpinner size="large" message="결제중입니다. 잠시만 기다려주세요." />
      </div>
    </div>
  );
};

export default PaymentSpinner;