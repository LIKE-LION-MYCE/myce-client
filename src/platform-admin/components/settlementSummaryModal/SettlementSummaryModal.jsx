import styles from './SettlementSummaryModal.module.css';

function SettlementSummaryModal({ isOpen, onClose, onSubmit, cancelForm }) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>환불 내역</h2>

        {/* 박람회/신청자 정보 */}
        <div className={styles.infoBox}>
          <div className={styles.row}>
            <span className={styles.label}>박람회명</span>
            <span className={styles.value}>{cancelForm?.title || '-'}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>신청자</span>
            <span className={styles.value}>{cancelForm?.requesterName || '-'}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>게시 기간</span>
            <span className={styles.value}>
              {cancelForm?.startAt} ~ {cancelForm?.endAt}
            </span>
          </div>
        </div>

        {/* 결제 정보 */}
        <div className={styles.infoBox}>
          <div className={styles.row}>
            <span className={styles.label}>결제 수단</span>
            <span className={styles.value}>
              {cancelForm?.paymentType === 'CARD' ? '카드 결제' : '기타'}
            </span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>결제사</span>
            <span className={styles.value}>{cancelForm?.paymentCompanyName || '-'}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>결제 계좌/카드번호</span>
            <span className={styles.value}>{cancelForm?.paymentAccountInfo || '-'}</span>
          </div>
        </div>

        {/* 금액 정보 */}
        <div className={styles.feeBox}>
          <div className={styles.row}>
            <span className={styles.label}>총 결제 금액</span>
            <span className={styles.amount}>
              {cancelForm?.totalAmount?.toLocaleString()}원
            </span>
          </div>
        </div>

        {/* 버튼 */}
        <div className={styles.actionBox}>
          <button className={styles.cancelBtn} onClick={onClose}>취소</button>
          <button className={styles.submitBtn} onClick={onSubmit}>정산 요청</button>
        </div>
      </div>
    </div>
  );
}

export default SettlementSummaryModal;
