import React, { useState } from "react";
import { useTranslation } from "react-i18next";
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
  currentStatus,
  isRefundCompleted = false,
  onRefund,
  onCancel,
  onClose,
}) {
  const { t } = useTranslation();
  const [refundReason, setRefundReason] = useState('');

  // 상태별 환불 유형 결정
  const getRefundType = () => {
    const refundTypeKey = currentStatus || 'DEFAULT';
    const refundTypeData = t(`adPaymentRefundModal.refundTypes.${refundTypeKey}`, { returnObjects: true });
    
    const colorMap = {
      'PENDING_PUBLISH': '#10b981',
      'PUBLISHED': '#f59e0b', 
      'PENDING_CANCEL': '#6b7280',
      'DEFAULT': '#3b82f6'
    };

    return {
      type: refundTypeData.type,
      color: colorMap[refundTypeKey] || colorMap.DEFAULT,
      description: refundTypeData.description
    };
  };

  const refundType = getRefundType();

  const handleRefundSubmit = () => {
    if (!refundReason.trim()) {
      alert(t('adPaymentRefundModal.messages.reasonRequired'));
      return;
    }
    if (onRefund) {
      onRefund(refundReason);
    }
  };
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox}>
        <div className={styles.titleSection}>
          <h2 className={styles.title}>{t(isRefundCompleted ? 'adPaymentRefundModal.title.completed' : 'adPaymentRefundModal.title.pending')}</h2>
          <div className={styles.refundTypeBadge} style={{ backgroundColor: refundType.color }}>
            {refundType.type}
          </div>
        </div>
        <div className={styles.refundDescription}>
          {refundType.description}
        </div>
        <div className={styles.twoColumnLayout}>
          {/* 좌측 컬럼 */}
          <div className={styles.leftColumn}>
            {/* 좌측 상단: 결제 정보 */}
            <div className={styles.leftTopBox}>
              <div className={styles.row}>
                <span>{t('adPaymentRefundModal.fields.totalDays')}</span>
                <span>{totalDays}{t('adPaymentRefundModal.units.days')}</span>
              </div>
              {!isRefundCompleted && (
                <div className={styles.row}>
                  <span>{t('adPaymentRefundModal.fields.dailyFee')}</span>
                  <span>{feePerDay?.toLocaleString()}{t('adPaymentRefundModal.units.currency')}</span>
                </div>
              )}
              <div className={styles.row}>
                <span>{t('adPaymentRefundModal.fields.totalAmount')}</span>
                <span>{totalAmount?.toLocaleString()}{t('adPaymentRefundModal.units.currency')}</span>
              </div>
            </div>
            
            {/* 좌측 하단: 사용 정보 */}
            <div className={styles.leftBottomBox}>
              <div className={styles.row}>
                <span>{t('adPaymentRefundModal.fields.usedDays')}</span>
                <span>{usedDays}{t('adPaymentRefundModal.units.days')}</span>
              </div>
              <div className={styles.row}>
                <span>{t('adPaymentRefundModal.fields.usedAmount')}</span>
                <span>{usedAmount?.toLocaleString()}{t('adPaymentRefundModal.units.currency')}</span>
              </div>
              {!isRefundCompleted && (
                <>
                  <div className={styles.row}>
                    <span>{t('adPaymentRefundModal.fields.remainingDays')}</span>
                    <span>{remainingDays}{t('adPaymentRefundModal.units.days')}</span>
                  </div>
                  <div className={styles.row}>
                    <span>{t('adPaymentRefundModal.fields.refundFormula')}</span>
                    <span>{remainingDays}{t('adPaymentRefundModal.units.days')} × {feePerDay?.toLocaleString()}{t('adPaymentRefundModal.units.currency')}</span>
                  </div>
                </>
              )}
              <div className={`${styles.totalRow} ${styles.refundRow}`}>
                <span>{t(isRefundCompleted ? 'adPaymentRefundModal.fields.refundAmountCompleted' : 'adPaymentRefundModal.fields.refundAmountPending')}</span>
                <span className={styles.refundAmount}>{refundAmount?.toLocaleString()}{t('adPaymentRefundModal.units.currency')}</span>
              </div>
            </div>
          </div>
          
          {/* 우측 컬럼 */}
          <div className={styles.rightColumn}>
            {/* 우측 상단: 기본 정보 */}
            <div className={styles.rightTopBox}>
              <div className={styles.row}>
                <span>{t('adPaymentRefundModal.fields.advertisementTitle')}</span>
                <span>{advertisementTitle}</span>
              </div>
              <div className={styles.row}>
                <span>{t('adPaymentRefundModal.fields.applicant')}</span>
                <span>{applicantName}</span>
              </div>
              <div className={styles.row}>
                <span>{t('adPaymentRefundModal.fields.displayPeriod')}</span>
                <span>{displayStartDate} ~ {displayEndDate}</span>
              </div>
              <div className={styles.row}>
                <span>{t('adPaymentRefundModal.fields.refundRequestDate')}</span>
                <span>{refundRequestDate}</span>
              </div>
            </div>
            
            {/* 우측 하단: 환불 사유 */}
            {onRefund && !isRefundCompleted && (
              <div className={styles.rightBottomBox}>
                <label className={styles.refundReasonLabel}>{t('adPaymentRefundModal.fields.refundReason')}</label>
                <textarea
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder={t('adPaymentRefundModal.placeholders.refundReason')}
                  className={styles.refundReasonTextarea}
                  rows={4}
                />
              </div>
            )}
          </div>
        </div>
        
        {/* 하단 버튼 영역 */}
        <div className={styles.btnRow}>
          {isRefundCompleted ? (
            <button className={styles.blackBtn} onClick={onClose}>
              {t('adPaymentRefundModal.buttons.confirm')}
            </button>
          ) : (
            <>
              <button className={styles.whiteBtn} onClick={onCancel || onClose}>
                {t('adPaymentRefundModal.buttons.close')}
              </button>
              {onRefund && (
                <button className={`${styles.blackBtn} ${styles.refundBtn}`} onClick={handleRefundSubmit}>
                  {t('adPaymentRefundModal.buttons.refund')}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdPaymentRefundModal;