import React from 'react';
import styles from './SettlementReceiptModal.module.css';

const SettlementReceiptModal = ({ receiptData, onClose }) => {
  if (!receiptData) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.title}>정산 내역 확인</h2>
        <div className={styles.receiptContainer}>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.label}>박람회명</span>
              <span className={styles.value}>{receiptData.expoTitle}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>정산 요청일</span>
              <span className={styles.value}>{new Date(receiptData.settlementRequestDate).toLocaleDateString('ko-KR')}</span>
            </div>
          </div>

          {receiptData.ticketSales && receiptData.ticketSales.length > 0 && (
            <div className={styles.ticketSalesSection}>
              <h3>티켓 판매 내역</h3>
              <div className={styles.ticketSalesHeader}>
                <span>티켓명</span>
                <span>판매 개수</span>
                <span>총 판매 금액</span>
              </div>
              {receiptData.ticketSales.map((ticket, index) => (
                <div key={index} className={styles.ticketSalesItem}>
                  <span>{ticket.ticketName}</span>
                  <span>{ticket.soldCount}개</span>
                  <span>{ticket.totalSales.toLocaleString()}원</span>
                </div>
              ))}
            </div>
          )}

          <div className={styles.summarySection}>
            <div className={styles.summaryItem}>
              <span className={styles.label}>총 판매 금액</span>
              <span className={styles.value}>{receiptData.totalRevenue.toLocaleString()}원</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>플랫폼 수수료 ({receiptData.commissionRate}%)</span>
              <span className={styles.value}>-{receiptData.fee.toLocaleString()}원</span>
            </div>
            <div className={`${styles.summaryItem} ${styles.netProfit}`}>
              <span className={styles.label}>순수익</span>
              <span className={styles.value}>{receiptData.finalSettlementAmount.toLocaleString()}원</span>
            </div>
          </div>
        </div>
        <div className={styles.buttonArea}>
          <button className={styles.closeButton} onClick={onClose}>닫기</button>
        </div>
      </div>
    </div>
  );
};

export default SettlementReceiptModal;