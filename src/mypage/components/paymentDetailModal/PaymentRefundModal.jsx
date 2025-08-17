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
  refundReason,
  onRefund,
  onCancel,
  onClose,
  readOnly = false,
  isRefundCompleted = false, // 환불 완료 상태인지 구분하는 새로운 prop
}) {
  const [inputRefundReason, setInputRefundReason] = useState("");
  
  // 전액 환불 여부 확인 (게시 대기 상태)
  const isFullRefund = status === 'PENDING_PUBLISH';
  
  // 취소 대기 상태 여부 확인 (이미 취소 신청된 상태)
  const isPendingCancel = status === 'PENDING_CANCEL';
  
  // 총 등록금 계산 (총 결제금액 - 총 이용료)
  const calculateTotalDeposit = () => {
    return (totalAmount || 0) - (totalUsageFee || 0);
  };
  
  // 마이너스 값 처리 함수
  const safeValue = (value, defaultValue = 0) => {
    return (value && value >= 0) ? value : defaultValue;
  };
  
  const handleRefundClick = () => {
    if (!inputRefundReason.trim()) {
      alert("환불 사유를 입력해주세요.");
      return;
    }
    onRefund(inputRefundReason);
  };
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox}>
        <h2 className={styles.title}>
          {isRefundCompleted ? "환불 완료 내역" : isPendingCancel ? "환불 신청 내역" : readOnly ? "환불 내역" : "환불 신청서"}{isFullRefund && !readOnly && !isPendingCancel && " (전액 환불)"}
        </h2>
        <div className={styles.twoColumnLayout}>
          {/* 좌측 컬럼 */}
          <div className={styles.leftColumn}>
            {/* 좌측 상단: 결제 정보 */}
            <div className={styles.leftTopBox}>
              <div className={styles.row}>
                <span>총 게시 일수</span>
                <span>{totalDays}일</span>
              </div>
              <div className={styles.row}>
                <span>일일 이용료</span>
                <span>{dailyUsageFee?.toLocaleString()}원</span>
              </div>
              <div className={styles.row}>
                <span>총 등록금</span>
                <span>{calculateTotalDeposit()?.toLocaleString()}원</span>
              </div>
              <div className={styles.row}>
                <span>총 이용료</span>
                <span>{totalUsageFee?.toLocaleString()}원</span>
              </div>
              <div className={styles.row}>
                <span>총 결제 금액</span>
                <span>{totalAmount?.toLocaleString()}원</span>
              </div>
            </div>
            
            {/* 좌측 하단: 사용 정보 */}
            <div className={styles.leftBottomBox}>
              {!isFullRefund && !isRefundCompleted && !isPendingCancel && (
                <>
                  <div className={styles.row}>
                    <span>게시 일수</span>
                    <span>{safeValue(usedDays)}일</span>
                  </div>
                  <div className={styles.row}>
                    <span>사용 금액</span>
                    <span>{safeValue(usedAmount)?.toLocaleString()}원</span>
                  </div>
                  <div className={styles.row}>
                    <span>남은 일수</span>
                    <span>{safeValue(remainingDays)}일</span>
                  </div>
                  <div className={styles.row}>
                    <span>환불 계산식</span>
                    <span>{safeValue(remainingDays)}일 × {dailyUsageFee?.toLocaleString()}원</span>
                  </div>
                </>
              )}
              {isPendingCancel && (
                <>
                  <div className={styles.row}>
                    <span>게시 일수</span>
                    <span>{safeValue(usedDays)}일</span>
                  </div>
                  <div className={styles.row}>
                    <span>사용 금액</span>
                    <span>{safeValue(usedAmount)?.toLocaleString()}원</span>
                  </div>
                  <div className={styles.row}>
                    <span>남은 일수</span>
                    <span>{safeValue(remainingDays)}일</span>
                  </div>
                  <div className={styles.row}>
                    <span>등록금 환불</span>
                    <span>{status === 'PUBLISHED' ? '0' : calculateTotalDeposit()?.toLocaleString()}원</span>
                  </div>
                  <div className={styles.row}>
                    <span>이용료 환불</span>
                    <span>{status === 'PUBLISHED' ? refundAmount?.toLocaleString() : (refundAmount - calculateTotalDeposit())?.toLocaleString()}원</span>
                  </div>
                </>
              )}
              {isRefundCompleted && (
                <>
                  <div className={styles.row}>
                    <span>게시 일수</span>
                    <span>{safeValue(usedDays)}일</span>
                  </div>
                  <div className={styles.row}>
                    <span>사용 금액</span>
                    <span>{safeValue(usedAmount)?.toLocaleString()}원</span>
                  </div>
                </>
              )}
              <div className={`${styles.totalRow} ${styles.refundRow}`}>
                <span>{isRefundCompleted ? "환불 완료 금액" : "환불 예정 금액"}</span>
                <span className={styles.refundAmount}>{refundAmount?.toLocaleString()}원</span>
              </div>
            </div>
          </div>
          
          {/* 우측 컬럼 */}
          <div className={styles.rightColumn}>
            {/* 우측 상단: 기본 정보 */}
            <div className={styles.rightTopBox}>
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
            
            {/* 우측 하단: 환불 사유 */}
            {isPendingCancel ? (
              <div className={styles.rightBottomBox}>
                <label className={styles.refundReasonLabel}>
                  환불 사유
                </label>
                <div className={styles.refundReasonDisplay}>
                  {refundReason || "환불 사유가 없습니다."}
                </div>
              </div>
            ) : !readOnly && (
              <div className={styles.rightBottomBox}>
                <label htmlFor="refundReason" className={styles.refundReasonLabel}>
                  환불 사유 <span className={styles.required}>*</span>
                </label>
                <textarea
                  id="refundReason"
                  className={styles.refundReasonTextarea}
                  value={inputRefundReason}
                  onChange={(e) => setInputRefundReason(e.target.value)}
                  placeholder="환불 사유를 입력해주세요."
                  maxLength={500}
                  rows={4}
                />
                <div className={styles.charCount}>
                  {inputRefundReason.length}/500
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* 하단 버튼 영역 */}
        <div className={styles.btnRow}>
          {readOnly || isPendingCancel ? (
            <button className={styles.blackBtn} onClick={onClose}>
              확인
            </button>
          ) : (
            <>
              <button className={styles.whiteBtn} onClick={onCancel}>
                취소
              </button>
              <button className={`${styles.blackBtn} ${styles.refundBtn}`} onClick={handleRefundClick}>
                환불 신청
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default PaymentRefundModal;