import React, { useState } from "react";
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
  onRefund,
  onCancel,
  onClose,
}) {
  const [refundReason, setRefundReason] = useState('');

  // 상태별 환불 유형 결정
  const getRefundType = () => {
    switch(currentStatus) {
      case 'PENDING_PUBLISH':
        return { type: '전액 환불', color: '#10b981', description: '게시 전이므로 전액 환불됩니다.' };
      case 'PUBLISHED':
        return { type: '부분 환불', color: '#f59e0b', description: '남은 게시 기간만큼 환불됩니다.' };
      case 'PENDING_CANCEL':
        return { type: '환불 처리중', color: '#6b7280', description: '환불이 처리 중입니다.' };
      default:
        return { type: '환불 신청', color: '#3b82f6', description: '상태에 따라 환불 금액이 결정됩니다.' };
    }
  };

  const refundType = getRefundType();

  const handleRefundSubmit = () => {
    if (!refundReason.trim()) {
      alert('환불 사유를 입력해주세요.');
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
          <h2 className={styles.title}>광고 환불 신청 내역</h2>
          <div className={styles.refundTypeBadge} style={{ backgroundColor: refundType.color }}>
            {refundType.type}
          </div>
        </div>
        <div className={styles.refundDescription}>
          {refundType.description}
        </div>
        <div className={styles.infoSection}>
          <div>
            <div className={styles.row}>
              <span>광고명</span>
              <span>{advertisementTitle}</span>
            </div>
            <div className={styles.row}>
              <span>신청자</span>
              <span>{applicantName}</span>
            </div>
            <div className={styles.row}>
              <span>게시 기간</span>
              <span>{displayStartDate} ~ {displayEndDate}</span>
            </div>
            <div className={styles.row}>
              <span>환불 신청일</span>
              <span>{refundRequestDate}</span>
            </div>
          </div>
          <div className={styles.feeBox}>
            <div className={styles.row}>
              <span>총 게시 일수</span>
              <span>{totalDays}일</span>
            </div>
            <div className={styles.row}>
              <span>일일 광고비</span>
              <span>{feePerDay?.toLocaleString()}원</span>
            </div>
            <div className={styles.row}>
              <span>총 결제 금액</span>
              <span>{totalAmount?.toLocaleString()}원</span>
            </div>
            <hr className={styles.divider} />
            <div className={styles.row}>
              <span>사용 일수</span>
              <span>{usedDays}일</span>
            </div>
            <div className={styles.row}>
              <span>사용 금액</span>
              <span>{usedAmount?.toLocaleString()}원</span>
            </div>
            <div className={styles.row}>
              <span>남은 일수</span>
              <span>{remainingDays}일</span>
            </div>
            <div className={styles.row}>
              <span>환불 계산식</span>
              <span>{remainingDays}일 × {feePerDay?.toLocaleString()}원</span>
            </div>
            <div className={`${styles.totalRow} ${styles.refundRow}`}>
              <span>환불 예정 금액</span>
              <span className={styles.refundAmount}>{refundAmount?.toLocaleString()}원</span>
            </div>
          </div>
        </div>
        
        {/* 환불 사유 입력 영역 */}
        {onRefund && (
          <div className={styles.refundReasonSection}>
            <label className={styles.refundReasonLabel}>환불 사유</label>
            <textarea
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              placeholder="환불 사유를 입력해주세요"
              className={styles.refundReasonTextarea}
              rows={3}
            />
          </div>
        )}
        
        {/* 하단 버튼 영역 */}
        <div className={styles.btnRow}>
          <button className={styles.whiteBtn} onClick={onCancel || onClose}>
            닫기
          </button>
          {onRefund && (
            <button className={`${styles.blackBtn} ${styles.refundBtn}`} onClick={handleRefundSubmit}>
              환불 신청
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdPaymentRefundModal;