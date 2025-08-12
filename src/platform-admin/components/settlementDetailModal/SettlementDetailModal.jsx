import { useState, useEffect } from 'react';
import styles from './SettlementDetailModal.module.css';
import { fetchSettlementDetail } from '../../../api/service/platform-admin/expo/ExpoService';

function SettlementDetailModal({ isOpen, onClose, expoId }) {
  const [settlementData, setSettlementData] = useState(null);
  const [loading, setLoading] = useState(false);

  // 정산 데이터 로드
  const loadSettlementData = async () => {
    if (!expoId) return;
    
    try {
      setLoading(true);
      const response = await fetchSettlementDetail(expoId);
      setSettlementData(response);
    } catch (error) {
      console.error('정산 내역 조회 실패:', error);
      alert('정산 내역을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && expoId) {
      loadSettlementData();
    }
  }, [isOpen, expoId]);

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modal}>
          <h2 className={styles.title}>정산 내역</h2>
          <div style={{ padding: '20px', textAlign: 'center' }}>로딩 중...</div>
          <div className={styles.actionBox}>
            <button className={styles.cancelBtn} onClick={onClose}>닫기</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>정산 내역</h2>

        {settlementData ? (
          <>
            <div className={styles.infoBox}>
              <div className={styles.row}>
                <span className={styles.label}>박람회명</span>
                <span className={styles.value}>{settlementData.expoTitle}</span>
              </div>
              <div className={styles.row}>
                <span className={styles.label}>게시 기간</span>
                <span className={styles.value}>
                  {settlementData.displayStartDate} ~ {settlementData.displayEndDate}
                </span>
              </div>
              <div className={styles.row}>
                <span className={styles.label}>상태</span>
                <span className={styles.value}>{settlementData.status}</span>
              </div>
            </div>

            <div className={styles.feeBox}>
              <div className={styles.row}>
                <span className={styles.label}>총 매출</span>
                <span className={styles.amount}>{settlementData.totalRevenue?.toLocaleString()}원</span>
              </div>
              <div className={styles.row}>
                <span className={styles.label}>수수료율</span>
                <span className={styles.amount}>{settlementData.commissionRate}%</span>
              </div>
              <div className={styles.row}>
                <span className={styles.label}>수수료 금액</span>
                <span className={styles.amount}>{settlementData.commissionAmount?.toLocaleString()}원</span>
              </div>
              <div className={`${styles.row} ${styles.totalRow}`}>
                <span className={styles.totalLabel}>순수익</span>
                <span className={styles.totalAmount}>{settlementData.netProfit?.toLocaleString()}원</span>
              </div>
            </div>

            {settlementData.ticketSales && settlementData.ticketSales.length > 0 && (
              <div className={styles.infoBox}>
                <h3>티켓 판매 내역</h3>
                {settlementData.ticketSales.map((ticket, index) => (
                  <div key={index} className={styles.row}>
                    <span className={styles.label}>
                      {ticket.ticketName} ({ticket.ticketPrice?.toLocaleString()}원)
                    </span>
                    <span className={styles.value}>
                      {ticket.soldCount}매 판매 (총 {ticket.totalSales?.toLocaleString()}원)
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div style={{ padding: '20px', textAlign: 'center' }}>정산 내역을 불러올 수 없습니다.</div>
        )}

        <div className={styles.actionBox}>
          <button className={styles.cancelBtn} onClick={onClose}>닫기</button>
        </div>
      </div>
    </div>
  );
}

export default SettlementDetailModal;