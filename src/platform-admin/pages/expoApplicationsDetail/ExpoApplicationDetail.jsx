import styles from './ExpoApplicationDetail.module.css';
import ExpoApplicationForm from '../../components/expoApplicationForm/ExpoApplicationForm';
import OperatorApplicationForm from '../../components/operatorApplicationForm/OperatorApplicationForm';

function ExpoApplicationDetail() {
  return (
    <div className={styles.operatorContainer}>
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>박람회 기본 정보</h4>
        <ExpoApplicationForm/>
      </div>

      {/* Divider */}
      <div className={styles.divider} />

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>운영사 정보</h4>
        <OperatorApplicationForm/>
      </div>

      {/* Divider */}
      <div className={styles.divider} />
    </div>
  );
}

export default ExpoApplicationDetail;