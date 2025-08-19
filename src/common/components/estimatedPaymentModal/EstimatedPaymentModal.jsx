import React, { useState, useEffect } from 'react';
import { getActiveExpoFee } from '../../../api/service/fee/feeApi';
import styles from './EstimatedPaymentModal.module.css';

const EstimatedPaymentModal = ({ 
  isOpen, 
  onClose, 
  displayStartDate, 
  displayEndDate, 
  isPremium 
}) => {
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
        setError('요금 정보를 불러오는데 실패했습니다.');
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
          <h2 className={styles.title}>예상 결제금액</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <div className={styles.content}>
          {loading ? (
            <div className={styles.loading}>요금 정보를 불러오는 중...</div>
          ) : error ? (
            <div className={styles.error}>{error}</div>
          ) : payment ? (
            <>
              <div className={styles.summarySection}>
                <div className={styles.summaryItem}>
                  <span className={styles.label}>게시 기간:</span>
                  <span className={styles.value}>
                    {displayStartDate} ~ {displayEndDate} ({payment.displayDays}일)
                  </span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.label}>요금제:</span>
                  <span className={styles.value}>
                    {isPremium ? '프리미엄' : '기본'}
                  </span>
                </div>
              </div>

              <div className={styles.paymentDetails}>
                <h3 className={styles.sectionTitle}>상세 요금</h3>
                
                <div className={styles.paymentItem}>
                  <span className={styles.itemLabel}>일 사용료</span>
                  <span className={styles.itemValue}>{payment.dailyUsageFee.toLocaleString()}원/일</span>
                </div>
                
                <div className={styles.paymentItem}>
                  <span className={styles.itemLabel}>기간별 사용료 ({payment.displayDays}일)</span>
                  <span className={styles.itemValue}>{payment.totalUsageFee.toLocaleString()}원</span>
                </div>
                
                <div className={styles.paymentItem}>
                  <span className={styles.itemLabel}>기본 등록금</span>
                  <span className={styles.itemValue}>{payment.basicDeposit.toLocaleString()}원</span>
                </div>
                
                {isPremium && (
                  <div className={styles.paymentItem}>
                    <span className={styles.itemLabel}>프리미엄 이용료</span>
                    <span className={styles.itemValue}>{payment.premiumDeposit.toLocaleString()}원</span>
                  </div>
                )}
                
                <div className={styles.divider}></div>
                
                <div className={styles.totalSection}>
                  <div className={styles.totalItem}>
                    <span className={styles.totalLabel}>예상 등록금</span>
                    <span className={styles.totalValue}>{payment.depositAmount.toLocaleString()}원</span>
                  </div>
                  <div className={styles.totalItem}>
                    <span className={styles.totalLabel}>예상 사용료</span>
                    <span className={styles.totalValue}>{payment.totalUsageFee.toLocaleString()}원</span>
                  </div>
                  <div className={styles.totalItem}>
                    <span className={styles.totalLabel}>예상 총 결제금액</span>
                    <span className={styles.finalAmount}>{payment.totalAmount.toLocaleString()}원</span>
                  </div>
                </div>
              </div>

              <div className={styles.notice}>
                <h4 className={styles.noticeTitle}>💡 안내사항</h4>
                <ul className={styles.noticeList}>
                  <li>위 금액은 입력하신 정보를 바탕으로 한 예상 금액입니다.</li>
                  <li>실제 결제 시 금액이 다를 수 있습니다.</li>
                  <li>모든 요금은 부가세(VAT) 포함 금액입니다.</li>
                </ul>
              </div>
            </>
          ) : (
            <div className={styles.error}>결제 금액을 계산할 수 없습니다.</div>
          )}
        </div>

        <div className={styles.footer}>
          <button className={styles.confirmButton} onClick={onClose}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default EstimatedPaymentModal;