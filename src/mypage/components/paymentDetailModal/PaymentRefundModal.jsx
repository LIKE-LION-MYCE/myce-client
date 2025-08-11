import React from "react";
import styles from "./PaymentDetailModal.module.css";

function PaymentRefundModal({
  expoName,
  applicant,
  period,
  totalDays,
  dailyUsageFee,
  depositAmount,
  totalUsageFee,
  totalAmount,
  isPremium,
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
        <h2 className={styles.title}>환불 신청 내역</h2>
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
              <span>일일 이용료</span>
              <span>{dailyUsageFee?.toLocaleString()}원</span>
            </div>
            <div className={styles.row}>
              <span>{isPremium ? '프리미엄 등록금' : '기본 등록금'}</span>
              <span>{depositAmount?.toLocaleString()}원</span>
            </div>
            <div className={styles.row}>
              <span>총 이용료</span>
              <span>{totalUsageFee?.toLocaleString()}원</span>
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
              <span>{remainingDays}일 × {dailyUsageFee?.toLocaleString()}원</span>
            </div>
            <div className={`${styles.totalRow} ${styles.refundRow}`}>
              <span>환불 예정 금액</span>
              <span className={styles.refundAmount}>{refundAmount?.toLocaleString()}원</span>
            </div>
          </div>
        </div>
        {/* 하단 버튼 영역 */}
        <div className={styles.btnRow}>
          <button className={styles.whiteBtn} onClick={onCancel}>
            취소
          </button>
          <button className={`${styles.blackBtn} ${styles.refundBtn}`} onClick={onRefund}>
            환불 신청
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentRefundModal;