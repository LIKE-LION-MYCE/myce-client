import styles from './SettlementSummaryModal.module.css';

function SettlementSummaryModal({ isOpen, onClose, onSubmit}) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>정산 내역</h2>

        <div className={styles.infoBox}>
          <div className={styles.row}>
            <span className={styles.label}>박람회명</span>
            <span className={styles.value}>촌캉스 귀촌 체험 박람회</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>신청자</span>
            <span className={styles.value}>인포그램</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>게시 기간</span>
            <span className={styles.value}>2025-07-19 ~ 2025-07-19</span>
          </div>
        </div>

        <div className={styles.infoBox}>
          <div className={styles.row}>
            <span className={styles.label}>은행</span>
            <span className={styles.value}>우리은행</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>은행 계좌번호</span>
            <span className={styles.value}>1002-238-3239329</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>입금자명</span>
            <span className={styles.value}>홍길동</span>
          </div>
        </div>

        <div className={styles.feeBox}>
          <div className={styles.row}>
            <span className={styles.label}>사용료</span>
            <span className={styles.amount}>150,000원</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>일일 등록금</span>
            <span className={styles.amount}>600,000원</span>
          </div>
          <div className={`${styles.row} ${styles.totalRow}`}>
            <span className={styles.totalLabel}>총 결제 금액</span>
            <span className={styles.totalAmount}>750,000원</span>
          </div>
        </div>

        <div className={styles.actionBox}>
          <button className={styles.cancelBtn} onClick={onClose}>취소</button>
          <button className={styles.submitBtn} onClick={onSubmit}>정산 요청</button>
        </div>
      </div>
    </div>
  );
}

export default SettlementSummaryModal;