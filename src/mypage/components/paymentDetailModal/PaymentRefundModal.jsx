import React, { useState } from "react";
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
  status,
  onRefund,
  onCancel,
  onClose,
}) {
  const [refundReason, setRefundReason] = useState("");
  
  // 전액 환불 여부 확인 (게시 대기 상태)
  const isFullRefund = status === 'PENDING_PUBLISH';
  
  const handleRefundClick = () => {
    if (!refundReason.trim()) {
      alert("환불 사유를 입력해주세요.");
      return;
    }
    onRefund(refundReason);
  };
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox}>
        <h2 className={styles.title}>
          환불 신청서{isFullRefund && " (전액 환불)"}
        </h2>
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
            {!isFullRefund && (
              <>
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
              </>
            )}
            <div className={`${styles.totalRow} ${styles.refundRow}`}>
              <span>환불 예정 금액</span>
              <span className={styles.refundAmount}>{refundAmount?.toLocaleString()}원</span>
            </div>
          </div>
        </div>
        
        {/* 환불 사유 입력 섹션 */}
        <div className={styles.reasonSection}>
          <label htmlFor="refundReason" className={styles.reasonLabel}>
            환불 사유 <span className={styles.required}>*</span>
          </label>
          <textarea
            id="refundReason"
            className={styles.reasonInput}
            value={refundReason}
            onChange={(e) => setRefundReason(e.target.value)}
            placeholder="환불 사유를 입력해주세요."
            maxLength={500}
            rows={4}
          />
          <div className={styles.charCount}>
            {refundReason.length}/500
          </div>
        </div>
        
        {/* 하단 버튼 영역 */}
        <div className={styles.btnRow}>
          <button className={styles.whiteBtn} onClick={onCancel}>
            취소
          </button>
          <button className={`${styles.blackBtn} ${styles.refundBtn}`} onClick={handleRefundClick}>
            환불 신청
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentRefundModal;