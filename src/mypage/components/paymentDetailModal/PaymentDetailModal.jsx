import React from "react";
import styles from "./PaymentDetailModal.module.css";

// "children"으로 버튼 컴포넌트/요소 주입받음
function PaymentDetailModal({
  expoName,
  applicant,
  period,
  totalDays,
  dailyUsageFee,
  usageFeeAmount,
  depositAmount,
  premiumDepositAmount,
  isPremium,
  children,
  onClose,
}) {
  // 디버깅용 로그
  console.log('PaymentDetailModal - isPremium:', isPremium);
  console.log('PaymentDetailModal - depositAmount:', depositAmount);
  console.log('PaymentDetailModal - premiumDepositAmount:', premiumDepositAmount);
  console.log('PaymentDetailModal - usageFeeAmount:', usageFeeAmount);
  
  // 총액 계산: 프리미엄일 경우 (기본 등록금 + 프리미엄 이용료 + 사용료), 기본일 경우 (기본 등록금 + 사용료)
  const calculatedTotalAmount = isPremium 
    ? (depositAmount || 0) + (premiumDepositAmount || 0) + (usageFeeAmount || 0)
    : (depositAmount || 0) + (usageFeeAmount || 0);
    
  console.log('PaymentDetailModal - calculatedTotalAmount:', calculatedTotalAmount);
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
              <span>총 게시 일수</span>
              <span>{totalDays}일</span>
            </div>
            <div className={styles.row}>
              <span>일일 사용료</span>
              <span>{dailyUsageFee?.toLocaleString()}원</span>
            </div>
            <div className={styles.row}>
              <span>사용료 총액</span>
              <span>{usageFeeAmount?.toLocaleString()}원</span>
            </div>
            <div className={styles.row}>
              <span>기본 등록금</span>
              <span>{depositAmount?.toLocaleString()}원</span>
            </div>
            {isPremium && premiumDepositAmount > 0 && (
              <div className={styles.row}>
                <span>프리미엄 이용료</span>
                <span>{premiumDepositAmount?.toLocaleString()}원</span>
              </div>
            )}
            <div className={styles.totalRow}>
              <span>총 결제 금액</span>
              <span>{calculatedTotalAmount?.toLocaleString()}원</span>
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
