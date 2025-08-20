import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getActiveExpoFee } from '../../../api/service/fee/feeApi';
import styles from './EstimatedPaymentModal.module.css';

const EstimatedPaymentModal = ({ 
  isOpen, 
  onClose, 
  displayStartDate, 
  displayEndDate, 
  isPremium 
}) => {
  const { t } = useTranslation();
  const [feeData, setFeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 게시 기간 계산 (일 수)
  const calculateDisplayDays = () => {
    if (!displayStartDate || !displayEndDate) return 0;
    
    const start = new Date(displayStartDate);
    const end = new Date(displayEndDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1은 시작일 포함
    return diffDays;
  };

  // 요금 데이터 로드
  useEffect(() => {
    if (!isOpen) return;
    
    const fetchFeeData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getActiveExpoFee();
        setFeeData(response.data);
      } catch (err) {
        console.error('요금 정보 로드 실패:', err);
        setError(t('estimatedPaymentModal.error'));
      } finally {
        setLoading(false);
      }
    };

    fetchFeeData();
  }, [isOpen]);

  // 결제 금액 계산
  const calculatePayment = () => {
    if (!feeData) return null;

    const displayDays = calculateDisplayDays();
    const dailyUsageFee = feeData.dailyUsageFee || 0;
    const basicDeposit = feeData.deposit || 0;
    const premiumDeposit = feeData.premiumDeposit || 0;

    const totalUsageFee = dailyUsageFee * displayDays;
    
    let totalAmount;
    let depositAmount;
    
    if (isPremium) {
      // 프리미엄: 프리미엄 등록금 + 기본 등록금 + (게시기간 * 일 이용료)
      depositAmount = basicDeposit + premiumDeposit;
      totalAmount = depositAmount + totalUsageFee;
    } else {
      // 기본: 기본 등록금 + (게시기간 * 일 이용료)
      depositAmount = basicDeposit;
      totalAmount = depositAmount + totalUsageFee;
    }

    return {
      displayDays,
      dailyUsageFee,
      totalUsageFee,
      basicDeposit,
      premiumDeposit,
      depositAmount,
      totalAmount
    };
  };

  if (!isOpen) return null;

  const payment = calculatePayment();

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>{t('estimatedPaymentModal.title')}</h2>
          <button className={styles.closeButton} onClick={onClose}>{t('estimatedPaymentModal.buttons.close')}</button>
        </div>

        <div className={styles.content}>
          {loading ? (
            <div className={styles.loading}>{t('estimatedPaymentModal.loading')}</div>
          ) : error ? (
            <div className={styles.error}>{error}</div>
          ) : payment ? (
            <>
              <div className={styles.summarySection}>
                <div className={styles.summaryItem}>
                  <span className={styles.label}>{t('estimatedPaymentModal.summary.period')}</span>
                  <span className={styles.value}>
                    {displayStartDate} ~ {displayEndDate} ({payment.displayDays}{t('estimatedPaymentModal.summary.days')})
                  </span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.label}>{t('estimatedPaymentModal.summary.plan')}</span>
                  <span className={styles.value}>
                    {isPremium ? t('estimatedPaymentModal.summary.premium') : t('estimatedPaymentModal.summary.basic')}
                  </span>
                </div>
              </div>

              <div className={styles.paymentDetails}>
                <h3 className={styles.sectionTitle}>{t('estimatedPaymentModal.paymentDetails.title')}</h3>
                
                <div className={styles.paymentItem}>
                  <span className={styles.itemLabel}>{t('estimatedPaymentModal.paymentDetails.dailyUsageFee')}</span>
                  <span className={styles.itemValue}>{payment.dailyUsageFee.toLocaleString()}{t('estimatedPaymentModal.paymentDetails.dailyUnit')}</span>
                </div>
                
                <div className={styles.paymentItem}>
                  <span className={styles.itemLabel}>{t('estimatedPaymentModal.paymentDetails.periodUsageFee')} ({payment.displayDays}{t('estimatedPaymentModal.summary.days')})</span>
                  <span className={styles.itemValue}>{payment.totalUsageFee.toLocaleString()}{t('estimatedPaymentModal.paymentDetails.currency')}</span>
                </div>
                
                <div className={styles.paymentItem}>
                  <span className={styles.itemLabel}>{t('estimatedPaymentModal.paymentDetails.basicDeposit')}</span>
                  <span className={styles.itemValue}>{payment.basicDeposit.toLocaleString()}{t('estimatedPaymentModal.paymentDetails.currency')}</span>
                </div>
                
                {isPremium && (
                  <div className={styles.paymentItem}>
                    <span className={styles.itemLabel}>{t('estimatedPaymentModal.paymentDetails.premiumFee')}</span>
                    <span className={styles.itemValue}>{payment.premiumDeposit.toLocaleString()}{t('estimatedPaymentModal.paymentDetails.currency')}</span>
                  </div>
                )}
                
                <div className={styles.divider}></div>
                
                <div className={styles.totalSection}>
                  <div className={styles.totalItem}>
                    <span className={styles.totalLabel}>{t('estimatedPaymentModal.paymentDetails.estimatedDeposit')}</span>
                    <span className={styles.totalValue}>{payment.depositAmount.toLocaleString()}{t('estimatedPaymentModal.paymentDetails.currency')}</span>
                  </div>
                  <div className={styles.totalItem}>
                    <span className={styles.totalLabel}>{t('estimatedPaymentModal.paymentDetails.estimatedUsageFee')}</span>
                    <span className={styles.totalValue}>{payment.totalUsageFee.toLocaleString()}{t('estimatedPaymentModal.paymentDetails.currency')}</span>
                  </div>
                  <div className={styles.totalItem}>
                    <span className={styles.totalLabel}>{t('estimatedPaymentModal.paymentDetails.estimatedTotal')}</span>
                    <span className={styles.finalAmount}>{payment.totalAmount.toLocaleString()}{t('estimatedPaymentModal.paymentDetails.currency')}</span>
                  </div>
                </div>
              </div>

              <div className={styles.notice}>
                <h4 className={styles.noticeTitle}>{t('estimatedPaymentModal.notice.title')}</h4>
                <ul className={styles.noticeList}>
                  {t('estimatedPaymentModal.notice.items', { returnObjects: true }).map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <div className={styles.error}>{t('estimatedPaymentModal.cannotCalculate')}</div>
          )}
        </div>

        <div className={styles.footer}>
          <button className={styles.confirmButton} onClick={onClose}>
            {t('estimatedPaymentModal.buttons.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EstimatedPaymentModal;