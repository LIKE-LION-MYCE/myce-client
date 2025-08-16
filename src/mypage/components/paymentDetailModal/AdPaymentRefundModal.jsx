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
  isRefundCompleted = false,
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
          <h2 className={styles.title}>{isRefundCompleted ? "광고 환불 완료 내역" : "광고 환불 신청 내역"}</h2>
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
                <span>총 게시 일수</span>
                <span>{totalDays}일</span>
              </div>
              {!isRefundCompleted && (
                <div className={styles.row}>
                  <span>일일 광고비</span>
                  <span>{feePerDay?.toLocaleString()}원</span>
                </div>
              )}
              <div className={styles.row}>
                <span>총 결제 금액</span>
                <span>{totalAmount?.toLocaleString()}원</span>
              </div>
            </div>
            
            {/* 좌측 하단: 사용 정보 */}
            <div className={styles.leftBottomBox}>
              <div className={styles.row}>
                <span>사용 일수</span>
                <span>{usedDays}일</span>
              </div>
              <div className={styles.row}>
                <span>사용 금액</span>
                <span>{usedAmount?.toLocaleString()}원</span>
              </div>
              {!isRefundCompleted && (
                <>
                  <div className={styles.row}>
                    <span>남은 일수</span>
                    <span>{remainingDays}일</span>
                  </div>
                  <div className={styles.row}>
                    <span>환불 계산식</span>
                    <span>{remainingDays}일 × {feePerDay?.toLocaleString()}원</span>
                  </div>
                </>
              )}
              <div className={`${styles.totalRow} ${styles.refundRow}`}>
                <span>{isRefundCompleted ? "환불 완료 금액" : "환불 예정 금액"}</span>
                <span className={styles.refundAmount}>{refundAmount?.toLocaleString()}원</span>
              </div>
            </div>
          </div>
          
          {/* 우측 컬럼 */}
          <div className={styles.rightColumn}>
            {/* 우측 상단: 기본 정보 */}
            <div className={styles.rightTopBox}>
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
            
            {/* 우측 하단: 환불 사유 */}
            {onRefund && !isRefundCompleted && (
              <div className={styles.rightBottomBox}>
                <label className={styles.refundReasonLabel}>환불 사유</label>
                <textarea
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="환불 사유를 입력해주세요"
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
              확인
            </button>
          ) : (
            <>
              <button className={styles.whiteBtn} onClick={onCancel || onClose}>
                닫기
              </button>
              {onRefund && (
                <button className={`${styles.blackBtn} ${styles.refundBtn}`} onClick={handleRefundSubmit}>
                  환불 신청
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