import styles from './ToastSuccess.module.css';
import { FaCheckCircle } from 'react-icons/fa';

function ToastSuccess({ message }) {
  return (
    <div className={styles.toastBox}>
      <FaCheckCircle />
      <span>{message || '성공적으로 처리되었습니다.'}</span>
    </div>
  );
}

export default ToastSuccess;