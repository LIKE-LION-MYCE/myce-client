import styles from './ToastFail.module.css';
import { FaCheckCircle } from 'react-icons/fa';

function ToastFail() {
  return (
    <div className={styles.toastBox}>
      <FaCheckCircle />
      <span>요청이 실패되었습니다.</span>
    </div>
  );
}

export default ToastFail;
