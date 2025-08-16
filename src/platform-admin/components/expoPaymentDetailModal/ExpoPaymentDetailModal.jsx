import styles from './ExpoPaymentDetailModal.module.css';

function ExpoPaymentDetailModal({ isOpen, onClose, paymentDetail, onApprove }) {
  if (!isOpen) return null;
  
  // 총액 계산: 프리미엄일 경우 (기본 등록금 + 프리미엄 이용료 + 사용료), 기본일 경우 (기본 등록금 + 사용료)
  const calculateTotalAmount = (detail) => {
    if (!detail) return 0;
    const baseDeposit = detail.depositAmount || 0;
    const usageFee = detail.usageFeeAmount || 0;
    
    if (detail.isPremium && detail.premiumDepositAmount) {
      return baseDeposit + detail.premiumDepositAmount + usageFee;
    }
    return baseDeposit + usageFee;
  };
  
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
            <span className={styles.label}>기본 등록금</span>
            <span className={styles.amount}>
              {paymentDetail.depositAmount?.toLocaleString()}원
            </span>
          </div>
          {paymentDetail.isPremium && paymentDetail.premiumDepositAmount && (
            <div className={styles.row}>
              <span className={styles.label}>프리미엄 이용료</span>
              <span className={styles.amount}>
                {paymentDetail.premiumDepositAmount?.toLocaleString()}원
              </span>
            </div>
          )}
          <div className={`${styles.row} ${styles.totalRow}`}>
            <span className={styles.totalLabel}>총 결제 금액</span>
            <span className={styles.totalAmount}>
              {calculateTotalAmount(paymentDetail)?.toLocaleString()}원
            </span>
          </div>
        </div>

        <div className={styles.actionBox}>
          <button className={styles.cancelBtn} onClick={onClose}>닫기</button>
          {onApprove && (
            <button className={styles.approveBtn} onClick={onApprove}>
              승인하기
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExpoPaymentDetailModal;