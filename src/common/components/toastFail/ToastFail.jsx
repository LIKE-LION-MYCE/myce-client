import styles from './ToastFail.module.css';
import { FaCheckCircle } from 'react-icons/fa';

function ToastFail({message}) {
  return (
    <div className={styles.toastBox}>
      <FaCheckCircle />
      <span>{message}</span>
    </div>
  );
}

export default ToastFail;
