import styles from './cancelDetailModal.module.css';

function CancelDetailModal({ isOpen, onClose, cancelDetail }) {
  if (!isOpen) return null;

  if (!cancelDetail) {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modal}>
          <h2 className={styles.title}>취소 내역</h2>
          <p>취소 정보를 불러오는 중...</p>
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
        <h2 className={styles.title}>취소 내역</h2>

        <div className={styles.infoBox}>
          <div className={styles.row}>
            <span className={styles.label}>박람회명</span>
            <span className={styles.value}>{cancelDetail.expoTitle}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>신청자</span>
            <span className={styles.value}>{cancelDetail.applicantName}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>게시 기간</span>
            <span className={styles.value}>{cancelDetail.displayStartDate} ~ {cancelDetail.displayEndDate}</span>
          </div>
        </div>

        <div className={styles.infoBox}>
          <div className={styles.row}>
            <span className={styles.label}>총 결제 금액</span>
            <span className={styles.value}>{cancelDetail.totalAmount?.toLocaleString() || 0}원</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>사용한 금액</span>
            <span className={styles.value}>{cancelDetail.usedAmount?.toLocaleString() || 0}원</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>사용한 일수</span>
            <span className={styles.value}>{cancelDetail.usedDays || 0}일</span>
          </div>
        </div>

        <div className={styles.feeBox}>
          <div className={styles.row}>
            <span className={styles.label}>보증금</span>
            <span className={styles.amount}>{cancelDetail.depositAmount?.toLocaleString() || 0}원</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>환불 요청일</span>
            <span className={styles.amount}>{cancelDetail.refundRequestDate || '-'}</span>
          </div>
          <div className={`${styles.row} ${styles.totalRow}`}>
            <span className={styles.totalLabel}>총 환불 금액</span>
            <span className={styles.totalAmount}>{cancelDetail.refundAmount?.toLocaleString() || 0}원</span>
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