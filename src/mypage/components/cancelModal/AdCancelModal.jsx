import React from 'react';
import styles from './AdCancelModal.module.css';

function AdCancelModal({ 
  advertisementTitle, 
  applicantName, 
  displayStartDate, 
  displayEndDate, 
  currentStatus,
  onCancel, 
  onClose 
}) {
  
  // 상태별 취소 유형 결정
  const getCancelType = () => {
    switch(currentStatus) {
      case 'PENDING_APPROVAL':
        return { 
          type: '승인대기 취소', 
          color: '#6b7280', 
          description: '승인 대기 중인 광고를 취소합니다. 결제가 진행되지 않았으므로 별도 환불 절차가 없습니다.' 
        };
      case 'PENDING_PAYMENT':
        return { 
          type: '결제대기 취소', 
          color: '#f59e0b', 
          description: '결제 대기 중인 광고를 취소합니다. 결제가 완료되지 않았으므로 별도 환불 절차가 없습니다.' 
        };
      case 'PENDING_PUBLISH':
        return { 
          type: '게시예정 취소', 
          color: '#3b82f6', 
          description: '게시 예정인 광고를 취소합니다. 결제된 금액은 전액 환불됩니다.' 
        };
      case 'PUBLISHED':
        return { 
          type: '게시중 취소', 
          color: '#dc2626', 
          description: '현재 게시 중인 광고를 중단합니다. 남은 게시 기간에 대해서는 부분 환불됩니다.' 
        };
      case 'PENDING_CANCEL':
        return { 
          type: '취소 처리중', 
          color: '#6b7280', 
          description: '이미 취소 처리가 진행 중입니다.' 
        };
      default:
        return { 
          type: '광고 취소', 
          color: '#6b7280', 
          description: '광고를 취소합니다.' 
        };
    }
  };

  const cancelType = getCancelType();

  const handleCancelConfirm = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <h3>광고 취소</h3>
            <div className={styles.cancelTypeBadge} style={{ backgroundColor: cancelType.color }}>
              {cancelType.type}
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>
        
        <div className={styles.content}>
          <div className={styles.description}>
            {cancelType.description}
          </div>
          
          <div className={styles.adInfo}>
            <div className={styles.infoRow}>
              <label>광고명</label>
              <span>{advertisementTitle}</span>
            </div>
            <div className={styles.infoRow}>
              <label>신청자</label>
              <span>{applicantName}</span>
            </div>
            <div className={styles.infoRow}>
              <label>게시 기간</label>
              <span>{displayStartDate} ~ {displayEndDate}</span>
            </div>
            <div className={styles.infoRow}>
              <label>현재 상태</label>
              <span className={styles.statusText}>{getStatusLabel(currentStatus)}</span>
            </div>
          </div>
        </div>
        
        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>
            취소
          </button>
          <button className={styles.confirmBtn} onClick={handleCancelConfirm}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
}

// 상태 라벨 매핑
function getStatusLabel(status) {
  const statusMap = {
    'PENDING_APPROVAL': '승인대기',
    'PENDING_PAYMENT': '결제대기',
    'PENDING_PUBLISH': '게시예정',
    'PUBLISHED': '게시중',
    'COMPLETED': '게시완료',
    'REJECTED': '거절됨',
    'PENDING_CANCEL': '환불대기',
    'CANCELLED': '취소됨'
  };
  return statusMap[status] || status;
}

export default AdCancelModal;