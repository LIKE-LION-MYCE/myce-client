import styles from './cancelDetailModal.module.css';

function CancelDetailModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>취소 내역</h2>

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
            <span className={styles.label}>사용료 환불 금액</span>
            <span className={styles.amount}>100,000원</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>일일 등록금 환불 금액</span>
            <span className={styles.amount}>100,000원</span>
          </div>
          <div className={`${styles.row} ${styles.totalRow}`}>
            <span className={styles.totalLabel}>총 환불 금액</span>
            <span className={styles.totalAmount}>200,000원</span>
          </div>
        </div>

        <div className={styles.actionBox}>
          <button className={styles.cancelBtn} onClick={onClose}>닫기</button>
        </div>
      </div>
    </div>
  );
}

export default CancelDetailModal;