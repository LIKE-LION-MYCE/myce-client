import React, { useState } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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
      alert(t('paymentRefundModal.messages.reasonRequired'));
      return;
    }
    onRefund(inputRefundReason);
  };
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox}>
        <h2 className={styles.title}>
          {(() => {
            let titleKey;
            if (isRefundCompleted) {
              titleKey = 'paymentRefundModal.titles.refundCompleted';
            } else if (isPendingCancel) {
              titleKey = 'paymentRefundModal.titles.refundPending';
            } else if (readOnly) {
              titleKey = 'paymentRefundModal.titles.refundDetails';
            } else {
              titleKey = 'paymentRefundModal.titles.refundRequest';
            }
            const title = t(titleKey);
            const suffix = isFullRefund && !readOnly && !isPendingCancel ? t('paymentRefundModal.titles.fullRefundSuffix') : '';
            return title + suffix;
          })()}
        </h2>
        <div className={styles.twoColumnLayout}>
          {/* 좌측 컬럼 */}
          <div className={styles.leftColumn}>
            {/* 좌측 상단: 결제 정보 */}
            <div className={styles.leftTopBox}>
              <div className={styles.row}>
                <span>{t('paymentRefundModal.fields.totalDays')}</span>
                <span>{totalDays}{t('paymentRefundModal.units.days')}</span>
              </div>
              <div className={styles.row}>
                <span>{t('paymentRefundModal.fields.dailyUsageFee')}</span>
                <span>{dailyUsageFee?.toLocaleString()}{t('paymentRefundModal.units.currency')}</span>
              </div>
              <div className={styles.row}>
                <span>{t('paymentRefundModal.fields.totalDeposit')}</span>
                <span>{calculateTotalDeposit()?.toLocaleString()}{t('paymentRefundModal.units.currency')}</span>
              </div>
              <div className={styles.row}>
                <span>{t('paymentRefundModal.fields.totalUsageFee')}</span>
                <span>{totalUsageFee?.toLocaleString()}{t('paymentRefundModal.units.currency')}</span>
              </div>
              <div className={styles.row}>
                <span>{t('paymentRefundModal.fields.totalAmount')}</span>
                <span>{totalAmount?.toLocaleString()}{t('paymentRefundModal.units.currency')}</span>
              </div>
            </div>
            
            {/* 좌측 하단: 사용 정보 */}
            <div className={styles.leftBottomBox}>
              {!isFullRefund && !isRefundCompleted && !isPendingCancel && (
                <>
                  <div className={styles.row}>
                    <span>{t('paymentRefundModal.fields.publishedDays')}</span>
                    <span>{safeValue(usedDays)}{t('paymentRefundModal.units.days')}</span>
                  </div>
                  <div className={styles.row}>
                    <span>{t('paymentRefundModal.fields.usedAmount')}</span>
                    <span>{safeValue(usedAmount)?.toLocaleString()}{t('paymentRefundModal.units.currency')}</span>
                  </div>
                  <div className={styles.row}>
                    <span>{t('paymentRefundModal.fields.remainingDays')}</span>
                    <span>{safeValue(remainingDays)}{t('paymentRefundModal.units.days')}</span>
                  </div>
                  <div className={styles.row}>
                    <span>{t('paymentRefundModal.fields.refundFormula')}</span>
                    <span>{safeValue(remainingDays)}{t('paymentRefundModal.units.days')} × {dailyUsageFee?.toLocaleString()}{t('paymentRefundModal.units.currency')}</span>
                  </div>
                </>
              )}
              {isPendingCancel && (
                <>
                  <div className={styles.row}>
                    <span>{t('paymentRefundModal.fields.publishedDays')}</span>
                    <span>{safeValue(usedDays)}{t('paymentRefundModal.units.days')}</span>
                  </div>
                  <div className={styles.row}>
                    <span>{t('paymentRefundModal.fields.usedAmount')}</span>
                    <span>{safeValue(usedAmount)?.toLocaleString()}{t('paymentRefundModal.units.currency')}</span>
                  </div>
                  <div className={styles.row}>
                    <span>{t('paymentRefundModal.fields.remainingDays')}</span>
                    <span>{safeValue(remainingDays)}{t('paymentRefundModal.units.days')}</span>
                  </div>
                  <div className={styles.row}>
                    <span>{t('paymentRefundModal.fields.depositRefund')}</span>
                    <span>{status === 'PUBLISHED' ? '0' : calculateTotalDeposit()?.toLocaleString()}{t('paymentRefundModal.units.currency')}</span>
                  </div>
                  <div className={styles.row}>
                    <span>{t('paymentRefundModal.fields.usageFeeRefund')}</span>
                    <span>{status === 'PUBLISHED' ? refundAmount?.toLocaleString() : (refundAmount - calculateTotalDeposit())?.toLocaleString()}{t('paymentRefundModal.units.currency')}</span>
                  </div>
                </>
              )}
              {isRefundCompleted && (
                <>
                  <div className={styles.row}>
                    <span>{t('paymentRefundModal.fields.publishedDays')}</span>
                    <span>{safeValue(usedDays)}{t('paymentRefundModal.units.days')}</span>
                  </div>
                  <div className={styles.row}>
                    <span>{t('paymentRefundModal.fields.usedAmount')}</span>
                    <span>{safeValue(usedAmount)?.toLocaleString()}{t('paymentRefundModal.units.currency')}</span>
                  </div>
                </>
              )}
              <div className={`${styles.totalRow} ${styles.refundRow}`}>
                <span>{t(isRefundCompleted ? 'paymentRefundModal.fields.refundCompletedAmount' : 'paymentRefundModal.fields.refundPendingAmount')}</span>
                <span className={styles.refundAmount}>{refundAmount?.toLocaleString()}{t('paymentRefundModal.units.currency')}</span>
              </div>
            </div>
          </div>
          
          {/* 우측 컬럼 */}
          <div className={styles.rightColumn}>
            {/* 우측 상단: 기본 정보 */}
            <div className={styles.rightTopBox}>
              <div className={styles.row}>
                <span>{t('paymentRefundModal.fields.expoName')}</span>
                <span>{expoName}</span>
              </div>
              <div className={styles.row}>
                <span>{t('paymentRefundModal.fields.applicant')}</span>
                <span>{applicant}</span>
              </div>
              <div className={styles.row}>
                <span>{t('paymentRefundModal.fields.period')}</span>
                <span>{period}</span>
              </div>
              <div className={styles.row}>
                <span>{t('paymentRefundModal.fields.refundRequestDate')}</span>
                <span>{refundRequestDate}</span>
              </div>
            </div>
            
            {/* 우측 하단: 환불 사유 */}
            {isPendingCancel ? (
              <div className={styles.rightBottomBox}>
                <label className={styles.refundReasonLabel}>
                  {t('paymentRefundModal.fields.refundReason')}
                </label>
                <div className={styles.refundReasonDisplay}>
                  {refundReason || t('paymentRefundModal.messages.noRefundReason')}
                </div>
              </div>
            ) : !readOnly && (
              <div className={styles.rightBottomBox}>
                <label htmlFor="refundReason" className={styles.refundReasonLabel}>
                  {t('paymentRefundModal.fields.refundReason')} <span className={styles.required}>{t('paymentRefundModal.fields.requiredMark')}</span>
                </label>
                <textarea
                  id="refundReason"
                  className={styles.refundReasonTextarea}
                  value={inputRefundReason}
                  onChange={(e) => setInputRefundReason(e.target.value)}
                  placeholder={t('paymentRefundModal.placeholders.refundReason')}
                  maxLength={500}
                  rows={4}
                />
                <div className={styles.charCount}>
                  {inputRefundReason.length}{t('paymentRefundModal.messages.charCount')}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* 하단 버튼 영역 */}
        <div className={styles.btnRow}>
          {readOnly || isPendingCancel ? (
            <button className={styles.blackBtn} onClick={onClose}>
              {t('paymentRefundModal.buttons.confirm')}
            </button>
          ) : (
            <>
              <button className={styles.whiteBtn} onClick={onCancel}>
                {t('paymentRefundModal.buttons.cancel')}
              </button>
              <button className={`${styles.blackBtn} ${styles.refundBtn}`} onClick={handleRefundClick}>
                {t('paymentRefundModal.buttons.refund')}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default PaymentRefundModal;