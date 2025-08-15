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
      console.log('ExpoApplicationDetail - status 값:', expoData.status);
      setForm({ ...expoData });
      setIsPremium(expoData.isPremium);
      setStatus(expoData.status);
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

  // 결제 정보를 볼 수 있는 상태인지 확인하는 함수 (승인대기, 결제대기 제외)
  const canViewPaymentInfo = (status) => {
    const excludedStatuses = [
      '승인대기', '승인 대기',
      '결제대기', '결제 대기'
    ];
    return !excludedStatuses.includes(status);
  };

  const renderButtons = () => {
    console.log('ExpoApplicationDetail - renderButtons, current status:', status);
    
    // 상태가 로드되지 않았으면 버튼을 렌더링하지 않음
    if (!status || status.length === 0) {
      return null;
    }
    
    return (
      <div className={styles.buttonGroup}>
        {/* 상태별 영수증 버튼 */}
        <div className={styles.receiptButtons}>
          {(status === '결제대기' || status === '결제 대기') && (
            <button className={`${styles.button} ${styles.receiptButton}`} onClick={onPayButtonClick}>결제 신청</button>
          )}
          {(status === '게시종료' || status === '게시 종료') && (
            <button className={`${styles.button} ${styles.receiptButton}`} onClick={onSettlementReceiptClick}>정산 신청</button>
          )}
          {(status === '정산요청' || status === '정산 요청') && (
            <button className={`${styles.button} ${styles.receiptButton}`} onClick={onSettlementReceiptClick}>정산 정보 조회</button>
          )}
          {status === '종료됨' && (
            <button className={`${styles.button} ${styles.receiptButton}`} onClick={onSettlementReceiptClick}>정산 완료 정보 조회</button>
          )}
          {(status === '게시대기' || status === '게시 대기' || status === '게시중' || status === '게시 중') && (
            <button className={`${styles.button} ${styles.receiptButton}`} onClick={onRefundButtonClick}>환불 신청</button>
          )}
          {(status === '취소됨' || status === '취소 완료') && (
            <button className={`${styles.button} ${styles.receiptButton}`} onClick={onRefundButtonClick}>환불 정보</button>
          )}
          {canViewPaymentInfo(status) && (
            <button className={`${styles.button} ${styles.paymentInfoButton}`} onClick={onPaymentInfoClick}>결제 정보</button>
          )}
        </div>
        
        {/* 상태별 주요 액션 버튼 */}
        <div className={styles.actionButtons}>
          {(status === '승인대기' || status === '승인 대기' || status === '결제대기' || status === '결제 대기' || status === 'PENDING_APPROVAL' || status === 'PENDING_PAYMENT') && (
            <button className={`${styles.button} ${styles.cancelButton}`} onClick={onCancelExpo}>취소 신청</button>
          )}
        </div>
      </div>
    );
  };
  
  const renderAdminButton = () => {
    if (status === '게시대기' || status === '게시 대기' || status === '게시중' || status === '게시 중' || status === '종료됨' || status === '정산요청' || status === '정산 요청') {
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
      
      {/* 폼 상세 내용 */}
      <div className={styles.topRow}>
        <div className={styles.profileWrapper}>
          <img
            src={form.thumbnailUrl || "https://cdn.netongs.com/news/photo/202412/322861_127383_830.jpg"}
            alt="박람회 포스터"
            className={styles.profileImage}
          />
        </div>
        <div className={styles.formGrid}>
          <div className={`${styles.formGroup} ${styles.full}`}>
            <label className={styles.label}>박람회 이름</label>
            <input className={styles.inputField} value={form.name || ''} readOnly />
          </div>
          <div className={`${styles.formGroup} ${styles.full}`}>
            <label className={styles.label}>박람회 위치</label>
            <input className={styles.inputField} value={form.location || ''} readOnly />
          </div>
          <div className={`${styles.formGroup} ${styles.full}`}>
            <label className={styles.label}>최대 수용 인원</label>
            <input
              type="number"
              className={styles.inputField}
              value={form.capacity || ''}
              readOnly
            />
          </div>
          <div className={`${styles.formGroup} ${styles.full}`}>
            <label className={styles.label}>개최 기간</label>
            <input 
              className={styles.inputField} 
              value={`${form.startDate || ''} ~ ${form.endDate || ''}`} 
              readOnly 
            />
          </div>
          <div className={`${styles.formGroup} ${styles.full}`}>
            <label className={styles.label}>운영 시간</label>
            <input 
              className={styles.inputField} 
              value={`${form.startTime || ''} ~ ${form.endTime || ''}`} 
              readOnly 
            />
          </div>
          <div className={`${styles.formGroup} ${styles.full}`}>
            <label className={styles.label}>게시 기간</label>
            <input 
              className={styles.inputField} 
              value={`${form.postStartDate || ''} ~ ${form.postEndDate || ''}`} 
              readOnly 
            />
          </div>
          <div className={`${styles.formGroup} ${styles.full}`}>
            <label className={styles.label}>프리미엄 상위 노출 신청 여부</label>
            <div className={styles.toggleWrapper}>
              <ToggleSwitch checked={isPremium} disabled />
            </div>
          </div>
          <div className={`${styles.formGroup} ${styles.full}`}>
            <label className={styles.label}>카테고리</label>
            <div className={styles.badgeRow}>
              <div className={styles.badge}>{form.category || '카테고리 없음'}</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 회사 정보 추가 */}
      <div className={`${styles.infoGrid} ${styles.full}`}>
        <div className={styles.infoGroup}>
          <label className={styles.label}>회사명</label>
          <input className={styles.inputField} value={form.companyName || ''} readOnly />
        </div>
        <div className={styles.infoGroup}>
          <label className={styles.label}>회사 주소</label>
          <input className={styles.inputField} value={form.companyAddress || ''} readOnly />
        </div>
        <div className={styles.infoGroup}>
          <label className={styles.label}>사업자 번호</label>
          <input className={styles.inputField} value={form.businessRegistrationNumber || ''} readOnly />
        </div>
      </div>

      {/* 대표자 정보 추가 */}
      <div className={`${styles.infoGrid} ${styles.full}`}>
        <div className={styles.infoGroup}>
          <label className={styles.label}>대표명</label>
          <input className={styles.inputField} value={form.ceoName || ''} readOnly />
        </div>
        <div className={styles.infoGroup}>
          <label className={styles.label}>대표자 연락처</label>
          <input className={styles.inputField} value={form.ceoContact || ''} readOnly />
        </div>
        <div className={styles.infoGroup}>
          <label className={styles.label}>대표자 이메일</label>
          <input className={styles.inputField} value={form.ceoEmail || ''} readOnly />
        </div>
      </div>


      <div className={`${styles.formGroup} ${styles.full}`}>
        <label className={styles.label}>설명</label>
        <div className={styles.descriptionText}>
          {form.description || '상세 설명이 없습니다.'}
        </div>
      </div>
      
      
      {/* 티켓 정보 섹션 */}
      <div className={`${styles.formGroup} ${styles.full}`}>
        <label className={styles.label}>티켓 정보</label>
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
      
      {/* 하단 버튼 영역 - 환불 신청 버튼을 아래로 이동 */}
      <div className={styles.bottomButtonArea}>
        {renderButtons()}
      </div>
      
    </div>
  );
}

export default ExpoApplicationDetail;
