import styles from './Settlement.module.css';
import SettlementForm from '../../components/settlementForm/SettlementForm';
import SettlementReceipt from '../../components/settlementReceipt/SettlementReceipt';

function Settlement() {
  return (
    <div className={styles.settlementContainer}>
      <div className={styles.sectionRow}>
        <div className={styles.section}>
          <div className={styles.sectionTitle}>정산 요청</div>
          <SettlementForm />
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            정산 영수증 <span className={styles.newBadge}>NEW</span>
          </div>
          <SettlementReceipt />
        </div>
      </div>
    </div>
  );
}

export default Settlement;