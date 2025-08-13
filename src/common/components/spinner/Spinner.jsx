import styles from './Spinner.module.css';

const Spinner = () => {
  return (
    <div className={styles.spinnerContainer}>
      <div className={styles.spinner}></div>
      <p>데이터를 불러오는 중...</p>
    </div>
  );
};

export default Spinner;