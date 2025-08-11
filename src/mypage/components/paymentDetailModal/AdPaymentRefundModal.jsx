import React from "react";
import styles from "./PaymentDetailModal.module.css";

function AdPaymentRefundModal({
  advertisementTitle,
  applicantName,
  displayStartDate,
  displayEndDate,
  totalDays,
  feePerDay,
  totalAmount,
  refundRequestDate,
  usedDays,
  usedAmount,
  remainingDays,
  refundAmount,
  onRefund,
  onCancel,
  onClose,
}) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox}>
        <h2 className={styles.title}>광고 환불 신청 내역</h2>
        <div className={styles.infoSection}>
          <div>
            <div className={styles.row}>
              <span>광고명</span>
              <span>{advertisementTitle}</span>
            </div>
            <div className={styles.row}>
              <span>신청자</span>
              <span>{applicantName}</span>
            </div>
            <div className={styles.row}>
              <span>게시 기간</span>
              <span>{displayStartDate} ~ {displayEndDate}</span>
            </div>
            <div className={styles.row}>
              <span>환불 신청일</span>
              <span>{refundRequestDate}</span>
            </div>
          </div>
          <div className={styles.feeBox}>
            <div className={styles.row}>
              <span>총 게시 일수</span>
              <span>{totalDays}일</span>
            </div>
            <div className={styles.row}>
              <span>일일 광고비</span>
              <span>{feePerDay?.toLocaleString()}원</span>
            </div>
            <div className={styles.row}>
              <span>총 결제 금액</span>
              <span>{totalAmount?.toLocaleString()}원</span>
            </div>
            <hr className={styles.divider} />
            <div className={styles.row}>
              <span>사용 일수</span>
              <span>{usedDays}일</span>
            </div>
            <div className={styles.row}>
              <span>사용 금액</span>
              <span>{usedAmount?.toLocaleString()}원</span>
            </div>
            <div className={styles.row}>
              <span>남은 일수</span>
              <span>{remainingDays}일</span>
            </div>
            <div className={styles.row}>
              <span>환불 계산식</span>
              <span>{remainingDays}일 × {feePerDay?.toLocaleString()}원</span>
            </div>
            <div className={`${styles.totalRow} ${styles.refundRow}`}>
              <span>환불 예정 금액</span>
              <span className={styles.refundAmount}>{refundAmount?.toLocaleString()}원</span>
            </div>
          </div>
        </div>
        {/* 하단 버튼 영역 */}
        <div className={styles.btnRow}>
          <button className={styles.whiteBtn} onClick={onCancel || onClose}>
            닫기
          </button>
          {onRefund && (
            <button className={`${styles.blackBtn} ${styles.refundBtn}`} onClick={onRefund}>
              환불 신청
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdPaymentRefundModal;