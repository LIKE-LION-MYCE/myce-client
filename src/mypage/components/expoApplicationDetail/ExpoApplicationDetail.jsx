import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  
  // 카테고리 번역 매핑 함수
  const translateCategory = (category) => {
    const categoryMap = {
      '전체': t('homepage.categories.all'),
      'IT/테크/보안': t('homepage.categories.tech'),
      '뷰티/라이프스타일': t('homepage.categories.fashion'),
      '의료/헬스케어': t('homepage.categories.medical'),
      '예술/디자인/기타': t('homepage.categories.culture'),
      '식품/1차산업': t('homepage.categories.food'),
      '제조/생산': t('homepage.categories.create'),
      '건설/인프라': t('homepage.categories.infra'),
      '모빌리티/조선/해양': t('homepage.categories.mobility'),
      '에너지/환경': t('homepage.categories.energy'),
      '리테일/유통/물류': t('homepage.categories.retail'),
      '방위산업/우주': t('homepage.categories.space'),
      '교육/학습': t('homepage.categories.education'),
      '경영/금융/서비스': t('homepage.categories.service')
    };
    return categoryMap[category] || category;
  };
  
  // 디버그: i18n 키 테스트 (더 자세히)
  console.log('=== ExpoApplicationDetail i18n Debug ===');
  console.log('Current language:', localStorage.getItem('language') || 'ko');
  console.log('Test expoStatus:', t('mypageGeneral.expoStatus.title'));
  console.log('Test detail section:', t('mypageGeneral.expoStatus.detail.loading'));
  console.log('Test buttons section:', t('mypageGeneral.expoStatus.detail.buttons.paymentRequest'));
  console.log('Test fields section exists:', typeof t('mypageGeneral.expoStatus.detail.fields'));
  console.log('Test fields.description:', t('mypageGeneral.expoStatus.detail.fields.description'));
  console.log('Test fields.companyName:', t('mypageGeneral.expoStatus.detail.fields.companyName'));
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
    // 상태별 직접 매핑으로 더 간단하고 확실하게 처리
    const statusMapping = {
      // 영어 키들
      'PENDING_APPROVAL': { key: 'PENDING_APPROVAL', style: 'pending' },
      'PENDING_PAYMENT': { key: 'PENDING_PAYMENT', style: 'paymentPending' },
      'PENDING_PUBLISH': { key: 'PENDING_PUBLISH', style: 'pending' },
      'PENDING_CANCEL': { key: 'PENDING_CANCEL', style: 'pending' },
      'PUBLISHED': { key: 'PUBLISHED', style: 'inProgress' },
      'PUBLISH_ENDED': { key: 'PUBLISH_ENDED', style: 'inProgress' },
      'SETTLEMENT_REQUESTED': { key: 'SETTLEMENT_REQUESTED', style: 'settled' },
      'COMPLETED': { key: 'COMPLETED', style: 'completed' },
      'REJECTED': { key: 'REJECTED', style: 'rejected' },
      'CANCELLED': { key: 'CANCELLED', style: 'cancelled' },
      
      // 한국어 키들 (백엔드가 한국어로 보낼 경우 대비)
      '승인대기': { key: 'PENDING_APPROVAL', style: 'pending' },
      '승인 대기': { key: 'PENDING_APPROVAL', style: 'pending' },
      '결제대기': { key: 'PENDING_PAYMENT', style: 'paymentPending' },
      '결제 대기': { key: 'PENDING_PAYMENT', style: 'paymentPending' },
      '게시대기': { key: 'PENDING_PUBLISH', style: 'pending' },
      '게시 대기': { key: 'PENDING_PUBLISH', style: 'pending' },
      '취소대기': { key: 'PENDING_CANCEL', style: 'pending' },
      '취소 대기': { key: 'PENDING_CANCEL', style: 'pending' },
      '게시중': { key: 'PUBLISHED', style: 'inProgress' },
      '게시 중': { key: 'PUBLISHED', style: 'inProgress' },
      '게시종료': { key: 'PUBLISH_ENDED', style: 'inProgress' },
      '게시 종료': { key: 'PUBLISH_ENDED', style: 'inProgress' },
      '정산요청': { key: 'SETTLEMENT_REQUESTED', style: 'settled' },
      '정산 요청': { key: 'SETTLEMENT_REQUESTED', style: 'settled' },
      '종료됨': { key: 'COMPLETED', style: 'completed' },
      '거절됨': { key: 'REJECTED', style: 'rejected' },
      '승인 거절': { key: 'REJECTED', style: 'rejected' },
      '취소됨': { key: 'CANCELLED', style: 'cancelled' },
      '취소 완료': { key: 'CANCELLED', style: 'cancelled' }
    };

    const statusConfig = statusMapping[status];
    if (!statusConfig) {
      return null;
    }

    const statusText = t(`expoStatus.status.${statusConfig.key}`);
    
    return (
      <span className={`${styles.statusTag} ${styles[statusConfig.style]}`}>
        {statusText}
      </span>
    );
  };

  // 상태 확인 헬퍼 함수들
  const isStatus = (currentStatus, targetStatuses) => {
    const normalizedStatus = currentStatus?.toUpperCase().replace(/\s+/g, '_');
    return targetStatuses.some(target => {
      if (typeof target === 'string' && target.includes('_')) {
        return normalizedStatus === target;
      }
      return currentStatus === target;
    });
  };

  // 결제 정보를 볼 수 있는 상태인지 확인하는 함수 
  const canViewPaymentInfo = (status) => {
    const excludedStatuses = [
      'PENDING_APPROVAL', '승인대기', '승인 대기',
      'PENDING_PAYMENT', '결제대기', '결제 대기',
      'REJECTED', '거절됨', '승인 거절'
    ];
    return !isStatus(status, excludedStatuses) && expoData?.paymentInfo;
  };
  
  // 환불 정보를 볼 수 있는지 확인하는 함수 (결제를 했고 취소/환불 상태인 경우)
  const canViewRefundInfo = (status) => {
    const refundStatuses = ['PENDING_CANCEL', 'CANCELLED', '취소대기', '취소 대기', '취소됨', '취소 완료'];
    return isStatus(status, refundStatuses) && expoData?.paymentInfo;
  };

  // 티켓 정보를 볼 수 있는지 확인하는 함수 (PENDING_APPROVAL, PENDING_PUBLISH 상태에서는 숨김)
  const canViewTicketInfo = (status) => {
    const hiddenStatuses = ['PENDING_APPROVAL', 'PENDING_PUBLISH', '승인대기', '승인 대기', '게시대기', '게시 대기'];
    return !isStatus(status, hiddenStatuses);
  };

  const renderButtons = () => {
    
    // 상태가 로드되지 않았으면 버튼을 렌더링하지 않음
    if (!status || status.length === 0) {
      return null;
    }
    
    return (
      <div className={styles.buttonGroup}>
        {/* 상태별 정보 조회 버튼 */}
        <div className={styles.receiptButtons}>
          {/* 결제 관련 버튼 */}
          {isStatus(status, ['PENDING_PAYMENT', '결제대기', '결제 대기']) && (
            <button className={`${styles.button} ${styles.receiptButton}`} onClick={onPayButtonClick}>{t('mypageGeneral.expoStatus.detail.buttons.paymentRequest')}</button>
          )}
          
          {/* 환불 관련 버튼 */}
          {isStatus(status, ['PENDING_PUBLISH', 'PUBLISHED', '게시대기', '게시 대기', '게시중', '게시 중']) && (
            <button className={`${styles.button} ${styles.receiptButton}`} onClick={onRefundButtonClick}>{t('mypageGeneral.expoStatus.detail.buttons.refundRequest')}</button>
          )}
          {isStatus(status, ['PENDING_CANCEL', 'CANCELLED', '취소대기', '취소 대기', '취소됨', '취소 완료']) && (
            <>
              {expoData?.paymentInfo ? (
                <button className={`${styles.button} ${styles.receiptButton}`} onClick={onRefundButtonClick}>{t('mypageGeneral.expoStatus.detail.buttons.refundInfo')}</button>
              ) : (
                <span className={styles.infoMessage}>{t('mypageGeneral.expoStatus.detail.defaultValues.noPaymentRefundInfo')}</span>
              )}
            </>
          )}
          
          {/* 정산 관련 버튼 */}
          {isStatus(status, ['PUBLISH_ENDED', '게시종료', '게시 종료']) && (
            <button className={`${styles.button} ${styles.receiptButton}`} onClick={onSettlementRequestClick}>{t('mypageGeneral.expoStatus.detail.buttons.settlementRequest')}</button>
          )}
          {isStatus(status, ['SETTLEMENT_REQUESTED', '정산요청', '정산 요청']) && (
            <button className={`${styles.button} ${styles.receiptButton}`} onClick={onSettlementReceiptClick}>{t('mypageGeneral.expoStatus.detail.buttons.settlementInfo')}</button>
          )}
          {isStatus(status, ['COMPLETED', '종료됨']) && (
            <button className={`${styles.button} ${styles.receiptButton}`} onClick={onSettlementReceiptClick}>{t('mypageGeneral.expoStatus.detail.buttons.settlementCompleted')}</button>
          )}
          
          {/* 결제 정보 조회 버튼 */}
          {canViewPaymentInfo(status) && (
            <button className={`${styles.button} ${styles.paymentInfoButton}`} onClick={onPaymentInfoClick}>{t('mypageGeneral.expoStatus.detail.buttons.paymentInfo')}</button>
          )}
        </div>
        
        {/* 상태별 주요 액션 버튼 */}
        <div className={styles.actionButtons}>
          {/* 취소 신청 버튼 */}
          {isStatus(status, ['PENDING_APPROVAL', 'PENDING_PAYMENT', '승인대기', '승인 대기', '결제대기', '결제 대기']) && (
            <button className={`${styles.button} ${styles.cancelButton}`} onClick={onCancelExpo}>{t('mypageGeneral.expoStatus.detail.buttons.cancelRequest')}</button>
          )}
          
          
        </div>
      </div>
    );
  };
  
  const renderAdminButton = () => {
    const adminStatuses = [
      'PENDING_PUBLISH', 'PUBLISHED', 'PUBLISH_ENDED', 'COMPLETED', 'SETTLEMENT_REQUESTED',
      '게시대기', '게시 대기', '게시중', '게시 중', '게시종료', '게시 종료', '종료됨', '정산요청', '정산 요청'
    ];
    
    if (isStatus(status, adminStatuses)) {
      return (
        <div className={styles.adminButtonGroup}>
          {/* 관리자 정보 버튼 */}
          <button className={`${styles.adminButton}`} onClick={onAdminInfoClick}>{t('mypageGeneral.expoStatus.detail.buttons.adminInfo')}</button>
          {/* 관리자 페이지로 이동 버튼 */}
          <button className={`${styles.adminPageButton}`} onClick={onAdminPageClick}>{t('mypageGeneral.expoStatus.detail.buttons.adminPage')}</button>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h2 className={styles.pageTitle}>{form.name || t('mypageGeneral.expoStatus.detail.pageTitle')}</h2>
          {renderStatusTag()}
          {renderAdminButton()}
        </div>
      </div>
      
      {/* 박람회 기본 정보 박스 */}
      <div className={styles.infoBoxContainer}>
        <div className={styles.posterSection}>
          <img
            src={form.thumbnailUrl || ""}
            alt={t('mypageGeneral.expoStatus.detail.altText.poster')}
            className={styles.posterImage}
          />
        </div>
        <div className={styles.infoSection}>
          <div className={styles.infoRow}>
            <div className={styles.infoItem}>
              <label className={styles.infoLabel}>{t('mypageGeneral.expoStatus.detail.fields.expoName')}</label>
              <div className={styles.infoValue}>{form.name || t('mypageGeneral.expoStatus.detail.defaultValues.noInfo')}</div>
            </div>
            <div className={styles.infoItem}>
              <label className={styles.infoLabel}>{t('mypageGeneral.expoStatus.detail.fields.location')}</label>
              <div className={styles.infoValue}>{form.location || t('mypageGeneral.expoStatus.detail.defaultValues.noInfo')}</div>
            </div>
          </div>
          <div className={styles.infoRow}>
            <div className={styles.infoItem}>
              <label className={styles.infoLabel}>{t('mypageGeneral.expoStatus.detail.fields.capacity')}</label>
              <div className={styles.infoValue}>{form.capacity ? `${form.capacity}명` : t('mypageGeneral.expoStatus.detail.defaultValues.noInfo')}</div>
            </div>
            <div className={styles.infoItem}>
              <label className={styles.infoLabel}>{t('mypageGeneral.expoStatus.detail.fields.period')}</label>
              <div className={styles.infoValue}>{`${form.startDate || ''} ~ ${form.endDate || ''}`}</div>
            </div>
          </div>
          <div className={styles.infoRow}>
            <div className={styles.infoItem}>
              <label className={styles.infoLabel}>{t('mypageGeneral.expoStatus.detail.fields.operatingTime')}</label>
              <div className={styles.infoValue}>{`${form.startTime || ''} ~ ${form.endTime || ''}`}</div>
            </div>
            <div className={styles.infoItem}>
              <label className={styles.infoLabel}>{t('mypageGeneral.expoStatus.detail.fields.postPeriod')}</label>
              <div className={styles.infoValue}>{`${form.postStartDate || ''} ~ ${form.postEndDate || ''}`}</div>
            </div>
          </div>
          <div className={styles.infoRow}>
            <div className={styles.infoItem}>
              <label className={styles.infoLabel}>{t('mypageGeneral.expoStatus.detail.fields.premium')}</label>
              <div className={styles.toggleWrapper}>
                <ToggleSwitch checked={isPremium} disabled />
              </div>
            </div>
            <div className={styles.infoItem}>
              <label className={styles.infoLabel}>{t('mypageGeneral.expoStatus.detail.fields.category')}</label>
              <div className={styles.badgeRow}>
                {form.category && form.category !== '카테고리 없음' ? (
                  form.category.split(', ').map((cat, index) => (
                    <div key={index} className={styles.badge}>{translateCategory(cat.trim())}</div>
                  ))
                ) : (
                  <div className={styles.badge}>{t('mypageGeneral.expoStatus.detail.defaultValues.noCategory')}</div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* 회사 정보 섹션 */}
        <div className={styles.additionalInfoSection}>
          <h3 className={styles.sectionTitle}>{t('mypageGeneral.expoStatus.detail.fields.companyInfo')}</h3>
          <div className={styles.infoRow}>
            <div className={styles.infoItem}>
              <label className={styles.infoLabel}>{t('mypageGeneral.expoStatus.detail.fields.companyName')}</label>
              <div className={styles.infoValue}>{form.companyName || t('mypageGeneral.expoStatus.detail.defaultValues.noInfo')}</div>
            </div>
            <div className={styles.infoItem}>
              <label className={styles.infoLabel}>{t('mypageGeneral.expoStatus.detail.fields.companyAddress')}</label>
              <div className={styles.infoValue}>{form.companyAddress || t('mypageGeneral.expoStatus.detail.defaultValues.noInfo')}</div>
            </div>
          </div>
          <div className={styles.infoRow}>
            <div className={styles.infoItem}>
              <label className={styles.infoLabel}>{t('mypageGeneral.expoStatus.detail.fields.businessNumber')}</label>
              <div className={styles.infoValue}>{form.businessRegistrationNumber || t('mypageGeneral.expoStatus.detail.defaultValues.noInfo')}</div>
            </div>
          </div>
          
          <h4 className={styles.subSectionTitle}>{t('mypageGeneral.expoStatus.detail.fields.ceoInfo')}</h4>
          <div className={styles.infoRow}>
            <div className={styles.infoItem}>
              <label className={styles.infoLabel}>{t('mypageGeneral.expoStatus.detail.fields.ceoName')}</label>
              <div className={styles.infoValue}>{form.ceoName || t('mypageGeneral.expoStatus.detail.defaultValues.noInfo')}</div>
            </div>
            <div className={styles.infoItem}>
              <label className={styles.infoLabel}>{t('mypageGeneral.expoStatus.detail.fields.ceoContact')}</label>
              <div className={styles.infoValue}>{form.ceoContact || t('mypageGeneral.expoStatus.detail.defaultValues.noInfo')}</div>
            </div>
          </div>
          <div className={styles.infoRow}>
            <div className={styles.infoItem}>
              <label className={styles.infoLabel}>{t('mypageGeneral.expoStatus.detail.fields.ceoEmail')}</label>
              <div className={styles.infoValue}>{form.ceoEmail || t('mypageGeneral.expoStatus.detail.defaultValues.noInfo')}</div>
            </div>
          </div>
        </div>

        {/* 상세 설명 섹션 */}
        <div className={styles.additionalInfoSection}>
          <h3 className={styles.sectionTitle}>
            {t('mypageGeneral.expoStatus.detail.fields.description') !== 'mypage.expoStatus.detail.fields.description' 
              ? t('mypageGeneral.expoStatus.detail.fields.description') 
              : (localStorage.getItem('language') === 'en' ? 'Description' : 
                 localStorage.getItem('language') === 'ja' ? '詳細説明' : '상세 설명')}
          </h3>
          <div className={styles.descriptionContent}>
            {form.description || t('mypageGeneral.expoStatus.detail.defaultValues.noDescription')}
          </div>
        </div>
        
        {/* 티켓 정보 섹션 - PENDING_APPROVAL, PENDING_PUBLISH 상태에서는 숨김 */}
        {canViewTicketInfo(status) && (
          <div className={styles.additionalInfoSection}>
            <h3 className={styles.sectionTitle}>{t('mypageGeneral.expoStatus.detail.fields.ticketInfo')}</h3>
            <div className={styles.ticketContainer}>
              {form.tickets && form.tickets.length > 0 ? (
                <>
                  {/* 티켓 헤더 */}
                  <div className={styles.ticketHeader}>
                    <div className={styles.ticketHeaderInfo}>
                      <span className={styles.headerLabel}>{t('mypageGeneral.expoStatus.detail.fields.ticketName')}</span>
                      <span className={styles.headerLabel}>{t('mypageGeneral.expoStatus.detail.fields.ticketPrice')}</span>
                      <span className={styles.headerLabel}>{t('mypageGeneral.expoStatus.detail.fields.ticketQuantity')}</span>
                      <span className={styles.headerLabel}>{t('mypageGeneral.expoStatus.detail.fields.ticketType')}</span>
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
                          {ticket.type === 'EARLY_BIRD' ? t('mypageGeneral.expoStatus.detail.ticketTypes.earlyBird') : t('mypageGeneral.expoStatus.detail.ticketTypes.general')}
                        </span>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className={styles.noTickets}>{t('mypageGeneral.expoStatus.detail.defaultValues.noTickets')}</div>
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
