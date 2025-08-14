import React, { useState } from 'react';
import styles from './SettlementReceiptModal.module.css';
import { requestExpoSettlement } from '../../../api/service/user/memberApi';

const bankOptions = ['토스뱅크', '카카오뱅크', '신한은행', '국민은행', '우리은행', '하나은행', '기업은행', 'NH농협은행'];

const SettlementReceiptModal = ({ receiptData, onClose, expoId }) => {
  if (!receiptData) return null;

  const [settlementForm, setSettlementForm] = useState({
    bankName: '',
    bankAccount: '',
    receiverName: '',
  });
  const [loading, setLoading] = useState(false);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setSettlementForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitSettlement = async () => {
    if (!settlementForm.bankName || !settlementForm.bankAccount || !settlementForm.receiverName) {
      alert('모든 은행 정보를 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      await requestExpoSettlement(expoId, settlementForm);
      alert('정산 신청이 완료되었습니다.');
      onClose();
    } catch (err) {
      console.error('정산 신청 실패:', err);
      const errorMessage = err.response?.data?.message || '정산 신청에 실패했습니다.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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

        {/* 은행계좌 입력 섹션 */}
        <div className={styles.settlementFormSection}>
          <h3 className={styles.formTitle}>정산 신청 정보</h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>은행</label>
              <select
                name="bankName"
                className={styles.formSelect}
                value={settlementForm.bankName}
                onChange={handleFormChange}
                disabled={loading}
              >
                <option value="">은행을 선택해주세요</option>
                {bankOptions.map((bank) => (
                  <option key={bank} value={bank}>
                    {bank}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>계좌번호</label>
              <input
                type="text"
                name="bankAccount"
                className={styles.formInput}
                value={settlementForm.bankAccount}
                onChange={handleFormChange}
                placeholder="계좌번호를 입력해주세요"
                disabled={loading}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>예금주명</label>
              <input
                type="text"
                name="receiverName"
                className={styles.formInput}
                value={settlementForm.receiverName}
                onChange={handleFormChange}
                placeholder="예금주명을 입력해주세요"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        <div className={styles.buttonArea}>
          <button className={styles.closeButton} onClick={onClose} disabled={loading}>
            닫기
          </button>
          <button 
            className={styles.submitButton} 
            onClick={handleSubmitSettlement}
            disabled={loading}
          >
            {loading ? '신청 중...' : '정산 신청'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettlementReceiptModal;