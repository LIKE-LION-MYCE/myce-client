import styles from './ExpoPaymentDetailModal.module.css';

function ExpoPaymentDetailModal({ isOpen, onClose, paymentDetail }) {
  if (!isOpen) return null;
  
  if (!paymentDetail) {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modal}>
          <h2 className={styles.title}>결제 내역</h2>
          <p>결제 정보를 불러오는 중...</p>
          <button onClick={onClose} className={styles.closeButton}>
            닫기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>박람회 결제 내역</h2>

        <div className={styles.infoBox}>
          <div className={styles.row}>
            <span className={styles.label}>박람회 제목</span>
            <span className={styles.value}>{paymentDetail.expoTitle}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>신청자</span>
            <span className={styles.value}>{paymentDetail.applicantName}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>게시 기간</span>
            <span className={styles.value}>
              {paymentDetail.displayStartDate} ~ {paymentDetail.displayEndDate}
            </span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>프리미엄 여부</span>
            <span className={styles.value}>
              {paymentDetail.isPremium ? '프리미엄' : '일반'}
            </span>
          </div>
        </div>

        <div className={styles.feeBox}>
          <div className={styles.row}>
            <span className={styles.label}>총 일수</span>
            <span className={styles.value}>{paymentDetail.totalDays}일</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>일당 사용료</span>
            <span className={styles.amount}>
              {paymentDetail.dailyUsageFee?.toLocaleString()}원
            </span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>사용료 총액</span>
            <span className={styles.amount}>
              {paymentDetail.usageFeeAmount?.toLocaleString()}원
            </span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>보증금</span>
            <span className={styles.amount}>
              {paymentDetail.depositAmount?.toLocaleString()}원
            </span>
          </div>
          <div className={`${styles.row} ${styles.totalRow}`}>
            <span className={styles.totalLabel}>총 결제 금액</span>
            <span className={styles.totalAmount}>
              {paymentDetail.totalAmount?.toLocaleString()}원
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

export default ExpoPaymentDetailModal;