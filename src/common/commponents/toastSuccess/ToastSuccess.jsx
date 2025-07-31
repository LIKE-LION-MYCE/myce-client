import styles from './ToastSuccess.module.css';
import { FaCheckCircle } from 'react-icons/fa';

function ToastSuccess({ message }) {
  return (
    <div className={styles.toastBox}>
      <FaCheckCircle />
      <span>{message}</span>
    </div>
  );
}

export default ToastSuccess;
