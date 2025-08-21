import styles from './PaymentDetailModal.module.css';

function PaymentDetailModal({ isOpen, onClose, paymentDetail }) {
  if (!isOpen) return null;

  const paymentType = paymentDetail?.paymentType;

  // 결제수단 한글 매핑
  const typeLabelMap = {
    CARD: '신용/체크카드',
    EASY_PAY: '간편결제',
    TRANSFER: '계좌이체',
    FOREIGN_PAY: '해외결제',
  };
  
  // 조건에 따라 동적으로 값 설정
  const isTransfer = paymentType === 'TRANSFER';
  const paymentTypeLabel = paymentType ? typeLabelMap[paymentType] : '-';
  const companyLabel = paymentType ? (isTransfer ? '은행' : '카드사') : '-';
  const accountLabel = paymentType ? (isTransfer ? '은행 계좌번호' : '카드 번호') : '-';

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

        {/* 결제 계좌 정보 */}
        <div className={styles.infoBox}>
          <div className={styles.row}>
            <span className={styles.label}>결제 수단</span>
            <span className={styles.value}>{paymentTypeLabel}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>{companyLabel}</span>
            <span className={styles.value}>{paymentType ? paymentDetail?.paymentCompanyName : '-'}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>{accountLabel}</span>
            <span className={styles.value}>{paymentType ? paymentDetail?.paymentAccountInfo : '-'}</span>
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