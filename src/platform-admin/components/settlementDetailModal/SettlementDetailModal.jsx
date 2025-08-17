import { useState, useEffect } from 'react';
import styles from './SettlementDetailModal.module.css';
import { fetchSettlementDetail, approveSettlement } from '../../../api/service/platform-admin/expo/ExpoService';

function SettlementDetailModal({ isOpen, onClose, expoId, readOnly = false, onSettlementApprove }) {
  const [settlementData, setSettlementData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [approving, setApproving] = useState(false);

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

  // 정산 승인 처리
  const handleSettlementApprove = async () => {
    if (!expoId) return;
    
    try {
      setApproving(true);
      await approveSettlement(expoId);
      alert('정산이 승인되었습니다.');
      onClose(); // 모달 닫기
      if (onSettlementApprove) {
        onSettlementApprove(); // 부모 컴포넌트에 승인 완료 알림
      }
    } catch (error) {
      console.error('정산 승인 실패:', error);
      alert('정산 승인 처리에 실패했습니다.');
    } finally {
      setApproving(false);
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
          <div className={styles.contentLayout}>
            {/* 왼쪽 섹션: 박람회 정보 + 티켓 판매 내역 */}
            <div className={styles.leftSection}>
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

              {settlementData.ticketSales && settlementData.ticketSales.length > 0 && (
                <div className={styles.ticketSalesSection}>
                  <h3 className={styles.sectionTitle}>티켓 판매 내역</h3>
                  <div className={styles.ticketTable}>
                    <div className={styles.ticketHeader}>
                      <span>티켓명</span>
                      <span>단가</span>
                      <span>판매 수량</span>
                      <span>매출액</span>
                    </div>
                    {settlementData.ticketSales.map((ticket, index) => (
                      <div key={index} className={styles.ticketRow}>
                        <span className={styles.ticketName}>{ticket.ticketName}</span>
                        <span className={styles.ticketPrice}>{ticket.ticketPrice?.toLocaleString()}원</span>
                        <span className={styles.ticketCount}>{ticket.soldCount}매</span>
                        <span className={styles.ticketSales}>{ticket.totalSales?.toLocaleString()}원</span>
                      </div>
                    ))}
                    <div className={styles.ticketTotal}>
                      <span>합계</span>
                      <span></span>
                      <span className={styles.totalCount}>
                        {settlementData.ticketSales.reduce((sum, t) => sum + t.soldCount, 0)}매
                      </span>
                      <span className={styles.totalAmount}>
                        {settlementData.ticketSales.reduce((sum, t) => sum + t.totalSales, 0).toLocaleString()}원
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 오른쪽 섹션: 금액 정보 + 은행 정보 */}
            <div className={styles.rightSection}>
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

              {/* 정산 요청 또는 완료 상태일 때 은행 정보 표시 */}
              {(settlementData.status === 'SETTLEMENT_REQUESTED' || settlementData.status === 'COMPLETED') && (
                <div className={styles.completionBox}>
                  <h3 className={styles.completionTitle}>
                    {settlementData.status === 'COMPLETED' ? '정산 완료 정보' : '정산 신청 정보'}
                  </h3>
                  <div className={styles.row}>
                    <span className={styles.label}>정산 계좌 예금주</span>
                    <span className={styles.value}>{settlementData.receiverName || '정보 없음'}</span>
                  </div>
                  <div className={styles.row}>
                    <span className={styles.label}>은행명</span>
                    <span className={styles.value}>{settlementData.bankName || '정보 없음'}</span>
                  </div>
                  <div className={styles.row}>
                    <span className={styles.label}>계좌번호</span>
                    <span className={styles.value}>{settlementData.bankAccount || '정보 없음'}</span>
                  </div>
                  {settlementData.status === 'COMPLETED' && (
                    <>
                      <div className={styles.row}>
                        <span className={styles.label}>정산 승인 시점</span>
                        <span className={styles.value}>{settlementData.settlementAt || '정보 없음'}</span>
                      </div>
                      <div className={styles.row}>
                        <span className={styles.label}>정산 처리 담당자</span>
                        <span className={styles.value}>{settlementData.adminName || '정보 없음'}</span>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{ padding: '20px', textAlign: 'center' }}>정산 내역을 불러올 수 없습니다.</div>
        )}

        <div className={styles.actionBox}>
          <button className={styles.cancelBtn} onClick={onClose}>닫기</button>
          {!readOnly && settlementData?.status !== 'COMPLETED' && (
            <button 
              className={styles.approveBtn} 
              onClick={handleSettlementApprove}
              disabled={approving}
            >
              {approving ? '승인 중...' : '정산 승인'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default SettlementDetailModal;