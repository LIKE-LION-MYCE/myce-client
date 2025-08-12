import React from "react";
import styles from "./PaymentDetailModal.module.css";

function AdPaymentDetailModal({
  advertisementTitle,
  applicantName,
  period,
  totalDays,
  feePerDay,
  totalAmount,
  status,
  onPay,
  onCancel,
  onClose,
}) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox}>
        <h2 className={styles.title}>광고 결제 정보</h2>
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
              <span>{period}</span>
            </div>
          </div>
          <div className={styles.feeBox}>
            <div className={styles.row}>
              <span>총 게시일</span>
              <span>{totalDays}일</span>
            </div>
            <div className={styles.row}>
              <span>일일 광고비</span>
              <span>{feePerDay?.toLocaleString()}원</span>
            </div>
            <div className={`${styles.totalRow}`}>
              <span>총 결제 금액</span>
              <span className={styles.totalAmount}>{totalAmount?.toLocaleString()}원</span>
            </div>
          </div>
        </div>
        {/* 하단 버튼 영역 */}
        <div className={styles.btnRow}>
          <button className={styles.whiteBtn} onClick={onCancel}>
            취소
          </button>
          <button className={styles.blackBtn} onClick={onPay}>
            결제하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdPaymentDetailModal;