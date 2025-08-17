import React, { useState, useEffect } from 'react';
import styles from './RefundModal.module.css';

const RefundModal = ({ isOpen, onClose, reservationId, onRefundComplete }) => {
  const [refundInfo, setRefundInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [reason, setReason] = useState('개인 사정');

  // 환불 정보 조회
  const getRefundPreview = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      const response = await fetch(`/api/refund/reservation/${reservationId}/preview`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setRefundInfo(data);
      } else {
        throw new Error('환불 정보를 가져올 수 없습니다.');
      }
    } catch (error) {
      alert(error.message);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  // 실제 환불 처리
  const handleRefund = async () => {
    if (!window.confirm('정말로 환불하시겠습니까?')) return;
    
    try {
      setProcessing(true);
      const token = localStorage.getItem('access_token');
      const response = await fetch(`/api/refund/reservation/${reservationId}?reason=${encodeURIComponent(reason)}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        alert('환불이 완료되었습니다.');
        onRefundComplete();
        onClose();
      } else {
        const errorText = await response.text();
        throw new Error(errorText || '환불 처리 중 오류가 발생했습니다.');
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    if (isOpen && reservationId) {
      getRefundPreview();
    }
  }, [isOpen, reservationId]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>예매 취소 및 환불</h3>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        {loading ? (
          <div className={styles.loading}>환불 정보를 확인하는 중...</div>
        ) : refundInfo ? (
          <div className={styles.content}>
            <div className={styles.infoSection}>
              <h4>환불 정보</h4>
              <div className={styles.infoItem}>
                <span>원본 결제금액:</span>
                <span>{refundInfo.originalAmount?.toLocaleString()}원</span>
              </div>
              <div className={styles.infoItem}>
                <span>환불 수수료:</span>
                <span className={styles.fee}>-{refundInfo.refundFee?.toLocaleString()}원</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.highlight}>실제 환불금액:</span>
                <span className={styles.highlight}>{refundInfo.actualRefundAmount?.toLocaleString()}원</span>
              </div>
              <div className={styles.infoItem}>
                <span>복원 마일리지:</span>
                <span className={styles.positive}>+{refundInfo.restoreMileage?.toLocaleString()}P</span>
              </div>
              <div className={styles.infoItem}>
                <span>차감 마일리지:</span>
                <span className={styles.negative}>-{refundInfo.deductMileage?.toLocaleString()}P</span>
              </div>
              <div className={styles.feeDescription}>
                <small>{refundInfo.feeDescription}</small>
              </div>
            </div>

            <div className={styles.reasonSection}>
              <label htmlFor="reason">취소 사유:</label>
              <select 
                id="reason" 
                value={reason} 
                onChange={(e) => setReason(e.target.value)}
                className={styles.reasonSelect}
              >
                <option value="개인 사정">개인 사정</option>
                <option value="일정 변경">일정 변경</option>
                <option value="건강상 이유">건강상 이유</option>
                <option value="기타">기타</option>
              </select>
            </div>

            <div className={styles.actions}>
              <button 
                className={styles.cancelBtn} 
                onClick={onClose}
                disabled={processing}
              >
                취소
              </button>
              <button 
                className={styles.refundBtn} 
                onClick={handleRefund}
                disabled={processing || refundInfo.actualRefundAmount <= 0}
              >
                {processing ? '처리중...' : '환불 신청'}
              </button>
            </div>

            {refundInfo.actualRefundAmount <= 0 && (
              <div className={styles.warning}>
                환불 불가 기간입니다. 수수료가 100%로 환불금액이 없습니다.
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default RefundModal;