import { useState, useMemo } from 'react';
import styles from './cancelDetailModal.module.css';

function CancelDetailModal({ isOpen, onClose, cancelDetail, onApprove, isPendingCancel = false }) {
  const [searchTerm, setSearchTerm] = useState('');

  // 검색어에 따른 예약자 필터링
  const filteredReservations = useMemo(() => {
    if (!cancelDetail?.reservationRefunds) return [];
    
    if (!searchTerm.trim()) {
      return cancelDetail.reservationRefunds;
    }
    
    const search = searchTerm.toLowerCase().trim();
    return cancelDetail.reservationRefunds.filter(refund => 
      refund.reservationCode?.toLowerCase().includes(search) ||
      refund.reserverName?.toLowerCase().includes(search) ||
      refund.ticketName?.toLowerCase().includes(search)
    );
  }, [cancelDetail?.reservationRefunds, searchTerm]);

  // 표시할 예약자 목록 (스크롤로 모든 항목 표시)
  const displayedReservations = filteredReservations;

  if (!isOpen) return null;

  // 백엔드에서 계산된 등록금/이용료 환불 금액 사용

  // 검색어 초기화 함수
  const handleSearchClear = () => {
    setSearchTerm('');
  };

  if (!cancelDetail) {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modal}>
          <h2 className={styles.title}>{isPendingCancel ? '환불 정보 확인' : '취소 내역'}</h2>
          <p>취소 정보를 불러오는 중...</p>
          <button onClick={onClose} className={styles.closeButton}>
            닫기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>{isPendingCancel ? '환불 정보 확인' : '취소 내역'}</h2>

        <div className={styles.contentLayout}>
          {/* 왼쪽 섹션: 박람회 정보 + 환불 금액 */}
          <div className={styles.leftSection}>
            <div className={styles.infoBox}>
              <div className={styles.row}>
                <span className={styles.label}>박람회명</span>
                <span className={styles.value}>{cancelDetail.expoTitle}</span>
              </div>
              <div className={styles.row}>
                <span className={styles.label}>신청자</span>
                <span className={styles.value}>{cancelDetail.applicantName}</span>
              </div>
              <div className={styles.row}>
                <span className={styles.label}>게시 기간</span>
                <span className={styles.value}>{cancelDetail.displayStartDate} ~ {cancelDetail.displayEndDate}</span>
              </div>
              <div className={styles.row}>
                <span className={styles.label}>환불 요청일</span>
                <span className={styles.value}>{cancelDetail.refundRequestDate || '-'}</span>
              </div>
            </div>

            <div className={styles.infoBox}>
              <div className={styles.row}>
                <span className={styles.label}>총 결제 금액</span>
                <span className={styles.value}>{cancelDetail.totalAmount?.toLocaleString() || 0}원</span>
              </div>
              <div className={styles.row}>
                <span className={styles.label}>사용한 금액</span>
                <span className={styles.value}>{cancelDetail.usedAmount?.toLocaleString() || 0}원</span>
              </div>
              <div className={styles.row}>
                <span className={styles.label}>사용한 일수</span>
                <span className={styles.value}>{cancelDetail.usedDays || 0}일</span>
              </div>
            </div>
          </div>

          {/* 오른쪽 섹션: 환불 금액 정보 */}
          <div className={styles.rightSection}>
            <div className={styles.feeBox}>
              <div className={styles.row}>
                <span className={styles.label}>등록금 환불</span>
                <span className={styles.amount}>{cancelDetail.depositRefundAmount?.toLocaleString() || 0}원</span>
              </div>
              <div className={styles.row}>
                <span className={styles.label}>이용료 환불</span>
                <span className={styles.amount}>{cancelDetail.usageFeeRefundAmount?.toLocaleString() || 0}원</span>
              </div>
              <div className={`${styles.row} ${styles.totalRow}`}>
                <span className={styles.totalLabel}>총 환불 금액</span>
                <span className={styles.totalAmount}>{cancelDetail.refundAmount?.toLocaleString() || 0}원</span>
              </div>
            </div>

            {/* 개별 예약자 환불 요약 */}
            {cancelDetail.totalReservations > 0 && (
              <div className={styles.reservationSummaryBox}>
                <h3 className={styles.summaryTitle}>개별 예약자 환불</h3>
                <div className={styles.row}>
                  <span className={styles.label}>총 예약자 수</span>
                  <span className={styles.amount}>{cancelDetail.totalReservations}명</span>
                </div>
                <div className={`${styles.row} ${styles.totalRow}`}>
                  <span className={styles.totalLabel}>총 환불 금액</span>
                  <span className={styles.totalAmount}>{cancelDetail.totalReservationAmount?.toLocaleString() || 0}원</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 개별 예약자 환불 상세 리스트 (하단 전체 폭) */}
        {cancelDetail.totalReservations > 0 && cancelDetail.reservationRefunds && cancelDetail.reservationRefunds.length > 0 && (
          <div className={styles.reservationDetailBox}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitle}>
                개별 예약자 환불 상세 ({filteredReservations.length}명)
              </div>
              
              {/* 검색 컨트롤 */}
              <div className={styles.controlsContainer}>
                <div className={styles.searchContainer}>
                  <input
                    type="text"
                    placeholder="예약자명, 예약번호, 티켓명 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                  />
                  {searchTerm && (
                    <button onClick={handleSearchClear} className={styles.clearButton}>
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            <div className={styles.reservationListContainer}>
              <div className={styles.listHeader}>
                <span>예약번호</span>
                <span>예약자</span>
                <span>티켓</span>
                <span>수량</span>
                <span>환불금액</span>
              </div>
              <div className={styles.scrollableList}>
                {displayedReservations.length > 0 ? (
                  displayedReservations.map((refund, index) => (
                    <div key={index} className={styles.listRow}>
                      <span className={styles.reservationCode}>{refund.reservationCode}</span>
                      <span className={styles.reserverName}>{refund.reserverName}</span>
                      <span className={styles.ticketName}>{refund.ticketName}</span>
                      <span className={styles.quantity}>{refund.quantity}개</span>
                      <span className={styles.amount}>{refund.refundAmount?.toLocaleString()}원</span>
                    </div>
                  ))
                ) : (
                  <div className={styles.noResults}>
                    검색 결과가 없습니다.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 환불 사유 섹션 */}
        {cancelDetail.refundReason && (
          <div className={styles.reasonBox}>
            <div className={styles.reasonTitle}>환불 사유</div>
            <div className={styles.reasonContent}>{cancelDetail.refundReason}</div>
          </div>
        )}

        <div className={styles.actionBox}>
          {isPendingCancel && onApprove ? (
            <>
              <button className={styles.cancelBtn} onClick={onClose}>취소</button>
              <button className={styles.approveBtn} onClick={onApprove}>
                {cancelDetail.totalReservations > 0 
                  ? `최종 승인 (${cancelDetail.totalReservations}명 환불)`
                  : '최종 승인'
                }
              </button>
            </>
          ) : (
            <button className={styles.cancelBtn} onClick={onClose}>닫기</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CancelDetailModal;