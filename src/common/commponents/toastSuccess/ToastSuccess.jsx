import styles from './ToastSuccess.module.css';
import { FaCheckCircle } from 'react-icons/fa';

function ToastSuccess() {
  return (
    <div className={styles.toastBox}>
      <FaCheckCircle />
      <span>성공적으로 처리되었습니다.</span>
    </div>
  );
}

export default ToastSuccess;
