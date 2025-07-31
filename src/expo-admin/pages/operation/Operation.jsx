import styles from './Operation.module.css';
import OperatorSection from '../../components/operatorSection/OperatorSection';
import ManagerSection from '../../components/managerSection/ManagerSection';

function Operation() {
  return (
    <div className={styles.operatorContainer}>
      {/* 운영사 정보 수정 */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>운영사 정보수정</h4>
        <OperatorSection />
      </div>

      {/* Divider */}
      <div className={styles.divider} />

      {/* 관리자 관리 */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>관리자 관리</h4>
        <ManagerSection />
      </div>
    </div>
  );
}

export default Operation;
