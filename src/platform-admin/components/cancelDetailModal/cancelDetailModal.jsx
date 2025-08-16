import styles from './cancelDetailModal.module.css';

function CancelDetailModal({ isOpen, onClose, cancelDetail, onApprove, isPendingCancel = false }) {
  if (!isOpen) return null;

  // 총 등록금 계산 (총 결제금액 - 총 이용료)
  const calculateTotalDeposit = () => {
    if (!cancelDetail) return 0;
    return (cancelDetail.totalAmount || 0) - (cancelDetail.totalUsageFee || 0);
  };

  if (!cancelDetail) {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modal}>
          <h2 className={styles.title}>{isPendingCancel ? '환불 정보 확인' : '취소 내역'}</h2>
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
        <h2 className={styles.title}>{isPendingCancel ? '환불 정보 확인' : '취소 내역'}</h2>

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
            <span className={styles.label}>환불 요청일</span>
            <span className={styles.amount}>{cancelDetail.refundRequestDate || '-'}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>등록금 환불</span>
            <span className={styles.amount}>{calculateTotalDeposit()?.toLocaleString() || 0}원</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>이용료 환불</span>
            <span className={styles.amount}>{(cancelDetail.refundAmount - calculateTotalDeposit())?.toLocaleString() || 0}원</span>
          </div>
          <div className={`${styles.row} ${styles.totalRow}`}>
            <span className={styles.totalLabel}>총 환불 금액</span>
            <span className={styles.totalAmount}>{cancelDetail.refundAmount?.toLocaleString() || 0}원</span>
          </div>
        </div>

        {/* 개별 예약자 환불 정보 섹션 */}
        {cancelDetail.totalReservations > 0 && (
          <div className={styles.reservationBox}>
            <div className={styles.sectionTitle}>개별 예약자 환불 내역</div>
            <div className={styles.reservationSummary}>
              <span className={styles.summaryText}>
                총 <strong>{cancelDetail.totalReservations}명</strong>의 예약자에게 
                <strong> {cancelDetail.totalReservationAmount?.toLocaleString() || 0}원</strong> 환불 예정
              </span>
            </div>
            
            {cancelDetail.reservationRefunds && cancelDetail.reservationRefunds.length > 0 && (
              <div className={styles.reservationList}>
                <div className={styles.listHeader}>
                  <span>예약번호</span>
                  <span>예약자</span>
                  <span>티켓</span>
                  <span>수량</span>
                  <span>환불금액</span>
                </div>
                {cancelDetail.reservationRefunds.slice(0, 5).map((refund, index) => (
                  <div key={index} className={styles.listRow}>
                    <span className={styles.reservationCode}>{refund.reservationCode}</span>
                    <span className={styles.reserverName}>{refund.reserverName}</span>
                    <span className={styles.ticketName}>{refund.ticketName}</span>
                    <span className={styles.quantity}>{refund.quantity}개</span>
                    <span className={styles.amount}>{refund.refundAmount?.toLocaleString()}원</span>
                  </div>
                ))}
                {cancelDetail.reservationRefunds.length > 5 && (
                  <div className={styles.moreIndicator}>
                    외 {cancelDetail.reservationRefunds.length - 5}건...
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 환불 사유 섹션 */}
        {cancelDetail.refundReason && (
          <div className={styles.reasonBox}>
            <div className={styles.reasonTitle}>환불 사유</div>
            <div className={styles.reasonContent}>{cancelDetail.refundReason}</div>
          </div>
        )}

        <div className={styles.actionBox}>
          {isPendingCancel && onApprove ? (
            <>
              <button className={styles.cancelBtn} onClick={onClose}>취소</button>
              <button className={styles.approveBtn} onClick={onApprove}>
                {cancelDetail.totalReservations > 0 
                  ? `최종 승인 (${cancelDetail.totalReservations}명 환불)`
                  : '최종 승인'
                }
              </button>
            </>
          ) : (
            <button className={styles.cancelBtn} onClick={onClose}>닫기</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CancelDetailModal;