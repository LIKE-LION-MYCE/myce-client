import React, { useEffect, useState } from 'react';
import styles from './ExpoApplicationDetail.module.css';
import ToggleSwitch from '../../../common/components/toggleSwitch/ToggleSwitch';

// ExpoApplicationDetail 컴포넌트가 props로 expoData, onPayButtonClick, onAdminInfoClick, onCancelExpo, onRefundButtonClick을 받도록 변경
function ExpoApplicationDetail({
  expoData,
  onPayButtonClick,
  onAdminInfoClick,
  onCancelExpo,
  onRefundButtonClick,
  onSettlementRequestClick,
  onSettlementReceiptClick,
  onPaymentInfoClick,
  onAdminPageClick,
}) {
  const [form, setForm] = useState({});
  const [isPremium, setIsPremium] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    // props로 받은 expoData를 상태에 설정
    if (expoData) {
      console.log('ExpoApplicationDetail - 받은 expoData:', expoData);
      console.log('ExpoApplicationDetail - isPremium 값:', expoData.isPremium);
      console.log('ExpoApplicationDetail - isPremium 타입:', typeof expoData.isPremium);
      console.log('ExpoApplicationDetail - status 값:', expoData.status);
      setForm({ ...expoData });
      setIsPremium(expoData.isPremium);
      setStatus(expoData.status);
      console.log('ExpoApplicationDetail - 설정된 isPremium 상태:', expoData.isPremium);
    }
  }, [expoData]); // expoData가 변경될 때마다 useEffect 실행

  const renderStatusTag = () => {
    switch (status) {
      case '승인대기':
      case '승인 대기':
        return <span className={`${styles.statusTag} ${styles.pending}`}>승인 대기</span>;
      case '결제대기':
      case '결제 대기':
        return <span className={`${styles.statusTag} ${styles.paymentPending}`}>결제 대기</span>;
      case '게시대기':
      case '게시 대기':
        return <span className={`${styles.statusTag} ${styles.pending}`}>게시 대기</span>;
      case '취소대기':
      case '취소 대기':
        return <span className={`${styles.statusTag} ${styles.pending}`}>취소 대기</span>;
      case '게시중':
      case '게시 중':
        return <span className={`${styles.statusTag} ${styles.inProgress}`}>게시 중</span>;
      case '게시종료':
      case '게시 종료':
        return <span className={`${styles.statusTag} ${styles.inProgress}`}>게시 종료</span>;
      case '정산요청':
      case '정산 요청':
        return <span className={`${styles.statusTag} ${styles.settled}`}>정산 요청</span>;
      case '종료됨':
        return <span className={`${styles.statusTag} ${styles.completed}`}>종료됨</span>;
      case '거절됨':
      case '승인 거절':
        return <span className={`${styles.statusTag} ${styles.rejected}`}>거절됨</span>;
      case '취소됨':
      case '취소 완료':
        return <span className={`${styles.statusTag} ${styles.cancelled}`}>취소됨</span>;
      default:
        return null;
    }
  };

  // 결제 정보를 볼 수 있는 상태인지 확인하는 함수 
  const canViewPaymentInfo = (status) => {
    const excludedStatuses = [
      '승인대기', '승인 대기',
      '결제대기', '결제 대기',
      '거절됨', '승인 거절'
    ];
    return !excludedStatuses.includes(status) && expoData?.paymentInfo;
  };
  
  // 환불 정보를 볼 수 있는지 확인하는 함수 (결제를 했고 취소/환불 상태인 경우)
  const canViewRefundInfo = (status) => {
    const refundStatuses = ['취소대기', '취소 대기', '취소됨', '취소 완료'];
    return refundStatuses.includes(status) && expoData?.paymentInfo;
  };

  // 티켓 정보를 볼 수 있는지 확인하는 함수 (PENDING_APPROVAL, PENDING_PUBLISH 상태에서는 숨김)
  const canViewTicketInfo = (status) => {
    const hiddenStatuses = ['승인대기', '승인 대기', '게시대기', '게시 대기'];
    return !hiddenStatuses.includes(status);
  };

  const renderButtons = () => {
    console.log('ExpoApplicationDetail - renderButtons, current status:', status);
    
    // 상태가 로드되지 않았으면 버튼을 렌더링하지 않음
    if (!status || status.length === 0) {
      return null;
    }
    
    return (
      <div className={styles.buttonGroup}>
        {/* 상태별 정보 조회 버튼 */}
        <div className={styles.receiptButtons}>
          {/* 결제 관련 버튼 */}
          {(status === '결제대기' || status === '결제 대기') && (
            <button className={`${styles.button} ${styles.receiptButton}`} onClick={onPayButtonClick}>결제 신청</button>
          )}
          
          {/* 환불 관련 버튼 */}
          {(status === '게시대기' || status === '게시 대기' || status === '게시중' || status === '게시 중') && (
            <button className={`${styles.button} ${styles.receiptButton}`} onClick={onRefundButtonClick}>환불 신청</button>
          )}
          {(status === '취소대기' || status === '취소 대기' || status === '취소됨' || status === '취소 완료') && (
            <>
              {expoData?.paymentInfo ? (
                <button className={`${styles.button} ${styles.receiptButton}`} onClick={onRefundButtonClick}>환불 정보</button>
              ) : (
                <span className={styles.infoMessage}>결제/환불 정보가 존재하지 않습니다.</span>
              )}
            </>
          )}
          
          {/* 정산 관련 버튼 */}
          {(status === '게시종료' || status === '게시 종료') && (
            <button className={`${styles.button} ${styles.receiptButton}`} onClick={onSettlementRequestClick}>정산 신청</button>
          )}
          {(status === '정산요청' || status === '정산 요청') && (
            <button className={`${styles.button} ${styles.receiptButton}`} onClick={onSettlementReceiptClick}>정산 정보 조회</button>
          )}
          {status === '종료됨' && (
            <button className={`${styles.button} ${styles.receiptButton}`} onClick={onSettlementReceiptClick}>정산 완료 정보 조회</button>
          )}
          
          {/* 결제 정보 조회 버튼 */}
          {canViewPaymentInfo(status) && (
            <button className={`${styles.button} ${styles.paymentInfoButton}`} onClick={onPaymentInfoClick}>결제 정보</button>
          )}
        </div>
        
        {/* 상태별 주요 액션 버튼 */}
        <div className={styles.actionButtons}>
          {/* 취소 신청 버튼 */}
          {(status === '승인대기' || status === '승인 대기' || status === '결제대기' || status === '결제 대기') && (
            <button className={`${styles.button} ${styles.cancelButton}`} onClick={onCancelExpo}>취소 신청</button>
          )}
          
          
        </div>
      </div>
    );
  };
  
  const renderAdminButton = () => {
    if (status === '게시대기' || status === '게시 대기' || status === '게시중' || status === '게시 중' || status === '게시종료' || status === '게시 종료' || status === '종료됨' || status === '정산요청' || status === '정산 요청') {
      return (
        <div className={styles.adminButtonGroup}>
          {/* 관리자 정보 버튼 */}
          <button className={`${styles.adminButton}`} onClick={onAdminInfoClick}>관리자 정보</button>
          {/* 관리자 페이지로 이동 버튼 */}
          <button className={`${styles.adminPageButton}`} onClick={onAdminPageClick}>관리자 페이지</button>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h2 className={styles.pageTitle}>{form.name || '신청 상세'}</h2>
          {renderStatusTag()}
          {renderAdminButton()}
        </div>
      </div>
      
      {/* 박람회 기본 정보 박스 */}
      <div className={styles.infoBoxContainer}>
        <div className={styles.posterSection}>
          <img
            src={form.thumbnailUrl || "https://cdn.netongs.com/news/photo/202412/322861_127383_830.jpg"}
            alt="박람회 포스터"
            className={styles.posterImage}
          />
        </div>
        <div className={styles.infoSection}>
          <div className={styles.infoRow}>
            <div className={styles.infoItem}>
              <label className={styles.infoLabel}>박람회 이름</label>
              <div className={styles.infoValue}>{form.name || '정보 없음'}</div>
            </div>
            <div className={styles.infoItem}>
              <label className={styles.infoLabel}>박람회 위치</label>
              <div className={styles.infoValue}>{form.location || '정보 없음'}</div>
            </div>
          </div>
          <div className={styles.infoRow}>
            <div className={styles.infoItem}>
              <label className={styles.infoLabel}>최대 수용 인원</label>
              <div className={styles.infoValue}>{form.capacity ? `${form.capacity}명` : '정보 없음'}</div>
            </div>
            <div className={styles.infoItem}>
              <label className={styles.infoLabel}>개최 기간</label>
              <div className={styles.infoValue}>{`${form.startDate || ''} ~ ${form.endDate || ''}`}</div>
            </div>
          </div>
          <div className={styles.infoRow}>
            <div className={styles.infoItem}>
              <label className={styles.infoLabel}>운영 시간</label>
              <div className={styles.infoValue}>{`${form.startTime || ''} ~ ${form.endTime || ''}`}</div>
            </div>
            <div className={styles.infoItem}>
              <label className={styles.infoLabel}>게시 기간</label>
              <div className={styles.infoValue}>{`${form.postStartDate || ''} ~ ${form.postEndDate || ''}`}</div>
            </div>
          </div>
          <div className={styles.infoRow}>
            <div className={styles.infoItem}>
              <label className={styles.infoLabel}>프리미엄 노출</label>
              <div className={styles.toggleWrapper}>
                <ToggleSwitch checked={isPremium} disabled />
              </div>
            </div>
            <div className={styles.infoItem}>
              <label className={styles.infoLabel}>카테고리</label>
              <div className={styles.badgeRow}>
                {form.category && form.category !== '카테고리 없음' ? (
                  form.category.split(', ').map((cat, index) => (
                    <div key={index} className={styles.badge}>{cat.trim()}</div>
                  ))
                ) : (
                  <div className={styles.badge}>카테고리 없음</div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* 회사 정보 섹션 */}
        <div className={styles.additionalInfoSection}>
          <h3 className={styles.sectionTitle}>회사 정보</h3>
          <div className={styles.infoRow}>
            <div className={styles.infoItem}>
              <label className={styles.infoLabel}>회사명</label>
              <div className={styles.infoValue}>{form.companyName || '정보 없음'}</div>
            </div>
            <div className={styles.infoItem}>
              <label className={styles.infoLabel}>회사 주소</label>
              <div className={styles.infoValue}>{form.companyAddress || '정보 없음'}</div>
            </div>
          </div>
          <div className={styles.infoRow}>
            <div className={styles.infoItem}>
              <label className={styles.infoLabel}>사업자 번호</label>
              <div className={styles.infoValue}>{form.businessRegistrationNumber || '정보 없음'}</div>
            </div>
          </div>
          
          <h4 className={styles.subSectionTitle}>대표자 정보</h4>
          <div className={styles.infoRow}>
            <div className={styles.infoItem}>
              <label className={styles.infoLabel}>대표명</label>
              <div className={styles.infoValue}>{form.ceoName || '정보 없음'}</div>
            </div>
            <div className={styles.infoItem}>
              <label className={styles.infoLabel}>대표자 연락처</label>
              <div className={styles.infoValue}>{form.ceoContact || '정보 없음'}</div>
            </div>
          </div>
          <div className={styles.infoRow}>
            <div className={styles.infoItem}>
              <label className={styles.infoLabel}>대표자 이메일</label>
              <div className={styles.infoValue}>{form.ceoEmail || '정보 없음'}</div>
            </div>
          </div>
        </div>

        {/* 상세 설명 섹션 */}
        <div className={styles.additionalInfoSection}>
          <h3 className={styles.sectionTitle}>상세 설명</h3>
          <div className={styles.descriptionContent}>
            {form.description || '상세 설명이 없습니다.'}
          </div>
        </div>
        
        {/* 티켓 정보 섹션 - PENDING_APPROVAL, PENDING_PUBLISH 상태에서는 숨김 */}
        {canViewTicketInfo(status) && (
          <div className={styles.additionalInfoSection}>
            <h3 className={styles.sectionTitle}>티켓 정보</h3>
            <div className={styles.ticketContainer}>
              {form.tickets && form.tickets.length > 0 ? (
                <>
                  {/* 티켓 헤더 */}
                  <div className={styles.ticketHeader}>
                    <div className={styles.ticketHeaderInfo}>
                      <span className={styles.headerLabel}>티켓명</span>
                      <span className={styles.headerLabel}>가격</span>
                      <span className={styles.headerLabel}>판매개수</span>
                      <span className={styles.headerLabel}>종류</span>
                    </div>
                  </div>
                  {/* 티켓 목록 */}
                  {form.tickets.map((ticket, index) => (
                    <div key={index} className={styles.ticketRow}>
                      <div className={styles.ticketInfo}>
                        <span className={styles.ticketName}>{ticket.name}</span>
                        <span className={styles.ticketPrice}>{ticket.price?.toLocaleString()}원</span>
                        <span className={styles.ticketQuantity}>{ticket.totalQuantity}개</span>
                        <span className={styles.ticketType}>
                          {ticket.type === 'EARLY_BIRD' ? '얼리버드' : '일반'}
                        </span>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className={styles.noTickets}>등록된 티켓이 없습니다.</div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* 하단 버튼 영역 - 박스 스타일로 변경 */}
      <div className={styles.buttonBoxContainer}>
        {renderButtons()}
      </div>
      
    </div>
  );
}

export default ExpoApplicationDetail;
