import React from "react";
import styles from "./PaymentDetailModal.module.css";

// "children"으로 버튼 컴포넌트/요소 주입받음
function PaymentDetailModal({
  expoName,
  applicant,
  period,
  amount,
  totalAmount,
  children,
  onClose,
}) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox}>
        <h2 className={styles.title}>결제 내역</h2>
        <div className={styles.infoSection}>
          <div>
            <div className={styles.row}>
              <span>박람회명</span>
              <span>{expoName}</span>
            </div>
            <div className={styles.row}>
              <span>신청자</span>
              <span>{applicant}</span>
            </div>
            <div className={styles.row}>
              <span>게시 기간</span>
              <span>{period}</span>
            </div>
          </div>
          <div className={styles.feeBox}>
            <div className={styles.row}>
              <span>총 이용료</span>
              <span>{amount.toLocaleString()}원</span>
            </div>
            <div className={styles.totalRow}>
              <span>총 결제 금액</span>
              <span>{totalAmount.toLocaleString()}원</span>
            </div>
          </div>
        </div>
        {/* 하단 버튼 영역 */}
        <div className={styles.btnRow}>{children}</div>
      </div>
    </div>
  );
}

export default PaymentDetailModal;
