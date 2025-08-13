import styles from './PaymentDetailModal.module.css';

function PaymentDetailModal({ isOpen, onClose, paymentDetail }) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>결제 내역</h2>

        <div className={styles.infoBox}>
          <div className={styles.row}>
            <span className={styles.label}>배너 제목</span>
            <span className={styles.value}>{paymentDetail?.title || '-'}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>신청자</span>
            <span className={styles.value}>{paymentDetail?.requesterName || '-'}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>게시 기간</span>
            <span className={styles.value}>
              {paymentDetail?.startAt || '-'} ~ {paymentDetail?.endAt || '-'}
            </span>
          </div>
        </div>

        <div className={styles.feeBox}>
          <div className={styles.row}>
            <span className={styles.label}>총 사용료</span>
            <span className={styles.amount}>
              {paymentDetail?.totalPrice?.toLocaleString() || '0'}원
            </span>
          </div>
          <div className={`${styles.row} ${styles.totalRow}`}>
            <span className={styles.totalLabel}>총 결제 금액</span>
            <span className={styles.totalAmount}>
              {paymentDetail?.totalPayment?.toLocaleString() || '0'}원
            </span>
          </div>
        </div>

        <div className={styles.actionBox}>
          <button className={styles.cancelBtn} onClick={onClose}>닫기</button>
        </div>
      </div>
    </div>
  );
}

export default PaymentDetailModal;