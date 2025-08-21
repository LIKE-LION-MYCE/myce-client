import styles from './AdCancelDetailModal.module.css';

function AdCancelDetailModal({ isOpen, onClose, cancelDetail }) {
  if (!isOpen) return null;

  const {
    endAt = '-',
    paymentAccountInfo = '-',
    paymentCompanyName = '-',
    paymentType = '-',
    requesterName = '-',
    startAt = '-',
    title = '-',
    totalAmount = 0,
  } = cancelDetail || {};

  // 결제수단 한글 매핑
  const typeLabelMap = {
    CARD: '신용/체크카드',
    EASY_PAY: '간편결제',
    TRANSFER: '계좌이체',
    FOREIGN_PAY: '해외결제',
  };
  const paymentTypeLabel = typeLabelMap[paymentType] || paymentType || '-';
  // 계좌/카드 명칭 분기
  const isTransfer = paymentType === 'TRANSFER';
  const companyLabel = isTransfer ? '은행' : '카드사';
  const accountLabel = isTransfer ? '은행 계좌번호' : '카드 번호';

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>취소 내역</h2>

        {/* 광고 기본 정보 */}
        <div className={styles.infoBox}>
          <div className={styles.row}>
            <span className={styles.label}>배너 제목</span>
            <span className={styles.value}>{title}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>신청자</span>
            <span className={styles.value}>{requesterName}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>게시 기간</span>
            <span className={styles.value}>{startAt} ~ {endAt}</span>
          </div>
        </div>

        {/* 환불 계좌 정보 */}
        <div className={styles.infoBox}>
          <div className={styles.row}>
            <span className={styles.label}>결제 수단</span>
            <span className={styles.value}>{paymentTypeLabel}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>{companyLabel}</span>
            <span className={styles.value}>{paymentCompanyName}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>{accountLabel}</span>
            <span className={styles.value}>{paymentAccountInfo}</span>
          </div>
        </div>

        {/* 환불 금액 정보 */}
        <div className={styles.feeBox}>
          <div className={`${styles.row} ${styles.totalRow}`}>
            <span className={styles.totalLabel}>총 환불 금액</span>
            <span className={styles.totalAmount}>{totalAmount.toLocaleString()}원</span>
          </div>
        </div>

        <div className={styles.actionBox}>
          <button className={styles.cancelBtn} onClick={onClose}>닫기</button>
        </div>
      </div>
    </div>
  );
}

export default AdCancelDetailModal;
