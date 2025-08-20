import React from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  
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
        <h2 className={styles.title}>{t('paymentDetailModal.title')}</h2>
        <div className={styles.infoSection}>
          <div>
            <div className={styles.row}>
              <span>{t('paymentDetailModal.fields.expoName')}</span>
              <span>{expoName}</span>
            </div>
            <div className={styles.row}>
              <span>{t('paymentDetailModal.fields.applicant')}</span>
              <span>{applicant}</span>
            </div>
            <div className={styles.row}>
              <span>{t('paymentDetailModal.fields.period')}</span>
              <span>{period}</span>
            </div>
          </div>
          <div className={styles.feeBox}>
            <div className={styles.row}>
              <span>{t('paymentDetailModal.fields.totalDays')}</span>
              <span>{totalDays}{t('paymentDetailModal.units.days')}</span>
            </div>
            <div className={styles.row}>
              <span>{t('paymentDetailModal.fields.dailyUsageFee')}</span>
              <span>{dailyUsageFee?.toLocaleString()}{t('paymentDetailModal.units.currency')}</span>
            </div>
            <div className={styles.row}>
              <span>{t('paymentDetailModal.fields.usageFeeAmount')}</span>
              <span>{usageFeeAmount?.toLocaleString()}{t('paymentDetailModal.units.currency')}</span>
            </div>
            <div className={styles.row}>
              <span>{t('paymentDetailModal.fields.basicDeposit')}</span>
              <span>{depositAmount?.toLocaleString()}{t('paymentDetailModal.units.currency')}</span>
            </div>
            {isPremium && premiumDepositAmount > 0 && (
              <div className={styles.row}>
                <span>{t('paymentDetailModal.fields.premiumFee')}</span>
                <span>{premiumDepositAmount?.toLocaleString()}{t('paymentDetailModal.units.currency')}</span>
              </div>
            )}
            <div className={styles.totalRow}>
              <span>{t('paymentDetailModal.fields.totalAmount')}</span>
              <span>{calculatedTotalAmount?.toLocaleString()}{t('paymentDetailModal.units.currency')}</span>
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
