import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./NonMemberReservationDetailPage.module.css";
import QRModal from "../../../mypage/components/qrModal/QRModal";

const NonMemberReservationDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [reservationData, setReservationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrImgUrl, setQrImgUrl] = useState("");
  const [selectedReserver, setSelectedReserver] = useState(null);

  useEffect(() => {
    // 비회원 예매 조회에서 전달된 데이터 확인
    if (location.state?.reservationData) {
      setReservationData(location.state.reservationData);
    } else {
      // 데이터가 없으면 이전 페이지로 이동
      setError(t('nonmember.reservationDetail.errors.notFound', '예매 정보를 찾을 수 없습니다.'));
      setTimeout(() => {
        navigate('/guest-reservation');
      }, 2000);
    }
  }, [location.state, navigate]);

  // QR 모달 열기 (회원 예매 상세와 동일한 로직)
  const handleQrOpen = (qrUrl, reserver) => {
    console.log('QR 버튼 클릭:', { qrUrl, reserver, isActive: isExpoActive() });
    
    if (!isExpoActive()) {
      alert(t('nonmember.reservationDetail.alerts.notExpoActive', '박람회 기간이 아닙니다.'));
      return;
    }
    
    if (!qrUrl) {
      alert(t('nonmember.reservationDetail.alerts.qrNotGenerated', 'QR 코드가 아직 생성되지 않았습니다.'));
      return;
    }
    
    setQrImgUrl(qrUrl);
    setSelectedReserver(reserver);
    setQrModalOpen(true);
  };

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    if (!dateString) return t('nonmember.reservationDetail.common.notAvailable', 'N/A');
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
  };

  // QR 코드 접근 가능 기간 체크 함수 (회원 예매 상세와 동일한 로직)
  const isExpoActive = () => {
    if (!reservationData?.expoInfo?.startDate || !reservationData?.expoInfo?.endDate) {
      return false;
    }
    
    const today = new Date();
    const startDate = new Date(reservationData.expoInfo.startDate);
    const endDate = new Date(reservationData.expoInfo.endDate);
    
    // 시간을 제거하고 날짜만 비교
    today.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    
    // QR 코드는 박람회 시작 2일 전부터 박람회 종료일까지 접근 가능
    const qrAvailableDate = new Date(startDate);
    qrAvailableDate.setDate(qrAvailableDate.getDate() - 2);
    
    return today >= qrAvailableDate && today <= endDate;
  };

  // 날짜 범위 포맷팅
  const formatDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return t('nonmember.reservationDetail.common.notAvailable', 'N/A');
    const start = formatDate(startDate);
    const end = formatDate(endDate);
    return `${start} ~ ${end}`;
  };

  // 시간 범위 포맷팅
  const formatTimeRange = (startTime, endTime) => {
    if (!startTime || !endTime) return t('nonmember.reservationDetail.common.notAvailable', 'N/A');
    return `${startTime} ~ ${endTime}`;
  };

  // 티켓 타입 한글 변환
  const formatTicketType = (ticketType) => {
    const typeMap = {
      'GENERAL': t('nonmember.reservationDetail.ticketTypes.general', '일반'),
      'EARLY_BIRD': t('nonmember.reservationDetail.ticketTypes.earlyBird', '얼리버드')
    };
    return typeMap[ticketType] || ticketType;
  };

  // 결제 방법 한글 변환
  const formatPaymentMethod = (method) => {
    const methodMap = {
      'CARD': t('nonmember.reservationDetail.paymentMethods.card', '카드'),
      'BANK_TRANSFER': t('nonmember.reservationDetail.paymentMethods.bankTransfer', '계좌이체'),
      'VIRTUAL_ACCOUNT': t('nonmember.reservationDetail.paymentMethods.virtualAccount', '가상계좌'),
      'SIMPLE_PAY': t('nonmember.reservationDetail.paymentMethods.simplePay', '간편결제')
    };
    return methodMap[method] || method;
  };

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.mainContent}>
            <h2 className={styles.pageTitle}>{t('nonmember.reservationDetail.title', '예매 정보 확인')}</h2>
            <div className={styles.loading}>{t('nonmember.reservationDetail.loading', '로딩 중...')}</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !reservationData) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.mainContent}>
            <h2 className={styles.pageTitle}>{t('nonmember.reservationDetail.title', '예매 정보 확인')}</h2>
            <div className={styles.error}>{error || t('nonmember.reservationDetail.errors.notFound', '예매 정보를 찾을 수 없습니다.')}</div>
          </div>
        </div>
      </div>
    );
  }

  const { expoInfo, reservationInfo, reserverInfos } = reservationData;

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.mainContent}>
          <h2 className={styles.pageTitle}>{t('nonmember.reservationDetail.title', '예매 정보 확인')}</h2>
          
          <div className={styles.contentGrid}>
          {/* 좌상단 - 박람회 정보 */}
          <section className={styles.gridSection}>
            <h3 className={styles.subTitle}>{t('nonmember.reservationDetail.sections.expoInfo', '박람회 정보')}</h3>
            <div className={styles.expoBox}>
              {expoInfo.thumbnailUrl && (
                <img 
                  src={expoInfo.thumbnailUrl} 
                  alt={t('nonmember.reservationDetail.expoInfo.thumbnailAlt', '박람회 썸네일')} 
                  className={styles.poster} 
                />
              )}
              <div className={styles.expoDetails}>
                <h4 className={styles.expoTitle}>{expoInfo.title}</h4>
                <div className={styles.eventPlace}>
                  {t('nonmember.reservationDetail.expoInfo.location', '장소')}: {expoInfo.location} {expoInfo.locationDetail}
                </div>
                <div className={styles.eventDate}>
                  {t('nonmember.reservationDetail.expoInfo.schedule', '일정')}: {formatDateRange(expoInfo.startDate, expoInfo.endDate)}
                </div>
                <div className={styles.eventDate}>
                  {t('nonmember.reservationDetail.expoInfo.time', '시간')}: {formatTimeRange(expoInfo.startTime, expoInfo.endTime)}
                </div>
              </div>
            </div>
          </section>

          {/* 우상단 - 티켓 사용 안내 */}
          <section className={styles.gridSection}>
            <h3 className={styles.subTitle}>{t('nonmember.reservationDetail.sections.ticketGuide', '티켓 사용 안내')}</h3>
            <div className={styles.ticketGuide}>
              <div>
                <div className={styles.label}>{t('nonmember.reservationDetail.ticketGuide.usagePeriod', '사용 가능 기간')}</div>
                <div>{formatDateRange(reservationInfo.ticketUseStartDate, reservationInfo.ticketUseEndDate)}</div>
              </div>
              <div className={styles.guideText}>
                • {t('nonmember.reservationDetail.ticketGuide.qrCodeInfo', '입장 시 QR코드를 제시해주세요.')}<br/>
                • {t('nonmember.reservationDetail.ticketGuide.checkPeriod', '티켓 사용 기간을 확인해주세요.')}<br/>
                • {t('nonmember.reservationDetail.ticketGuide.lossWarning', '분실 시 재발급이 어려우니 주의하세요.')}
              </div>
            </div>
          </section>

          {/* 중단 전체 - 참여 인원 */}
          <section className={`${styles.gridSection} ${styles.fullWidthMiddle}`}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.subTitle}>{t('nonmember.reservationDetail.sections.participants', '참여 인원')}</h3>
            </div>
            <table className={styles.memberTable}>
              <thead>
                <tr>
                  <th>{t('nonmember.reservationDetail.participants.name', '이름')}</th>
                  <th>{t('nonmember.reservationDetail.participants.reservationNumber', '예매번호')}</th>
                  <th>{t('nonmember.reservationDetail.participants.gender', '성별')}</th>
                  <th>{t('nonmember.reservationDetail.participants.phone', '전화번호')}</th>
                  <th>{t('nonmember.reservationDetail.participants.email', '이메일')}</th>
                  <th>{t('nonmember.reservationDetail.participants.qrCode', 'QR코드')}</th>
                </tr>
              </thead>
              <tbody>
                {reserverInfos?.map((member, idx) => (
                  <tr key={idx}>
                    <td>{member.name || t('nonmember.reservationDetail.common.notAvailable', 'N/A')}</td>
                    <td>{reservationInfo.reservationCode || t('nonmember.reservationDetail.common.notAvailable', 'N/A')}</td>
                    <td>{member.gender === 'MALE' ? t('nonmember.reservationDetail.genders.male', '남자') : member.gender === 'FEMALE' ? t('nonmember.reservationDetail.genders.female', '여자') : t('nonmember.reservationDetail.common.notAvailable', 'N/A')}</td>
                    <td>{member.phone || t('nonmember.reservationDetail.common.notAvailable', 'N/A')}</td>
                    <td>{member.email || t('nonmember.reservationDetail.common.notAvailable', 'N/A')}</td>
                    <td>
                      <button
                        className={`${styles.qrBtn} ${!isExpoActive() ? styles.qrBtnDisabled : ''}`}
                        onClick={() => handleQrOpen(member.qrCodeUrl, member)}
                        disabled={!isExpoActive()}
                      >
                        {isExpoActive() ? t('nonmember.reservationDetail.qr.viewDetails', '상세보기') : t('nonmember.reservationDetail.qr.outOfPeriod', '기간 외')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* 좌하단 - 예매 정보 */}
          <section className={styles.gridSection}>
            <h3 className={styles.subTitle}>{t('nonmember.reservationDetail.sections.reservationInfo', '예매 정보')}</h3>
            <div className={styles.reservationInfoGrid}>
              <div>
                <div className={styles.label}>{t('nonmember.reservationDetail.reservationInfo.reservationDate', '예매일')}</div>
                <div>{formatDate(reservationInfo.createdAt)}</div>
              </div>
              <div>
                <div className={styles.label}>{t('nonmember.reservationDetail.reservationInfo.ticketName', '티켓 이름')}</div>
                <div>{reservationInfo.ticketName || t('nonmember.reservationDetail.common.notAvailable', 'N/A')}</div>
              </div>
              <div>
                <div className={styles.label}>{t('nonmember.reservationDetail.reservationInfo.ticketType', '티켓 타입')}</div>
                <div>{formatTicketType(reservationInfo.ticketType) || t('nonmember.reservationDetail.common.notAvailable', 'N/A')}</div>
              </div>
              <div>
                <div className={styles.label}>{t('nonmember.reservationDetail.reservationInfo.quantity', '티켓 장수')}</div>
                <div>{reservationInfo.quantity}{t('nonmember.reservationDetail.reservationInfo.ticketUnit', '매')}</div>
              </div>
              <div>
                <div className={styles.label}>{t('nonmember.reservationDetail.reservationInfo.unitPrice', '단가')}</div>
                <div>{reservationInfo.ticketPrice?.toLocaleString()}{t('nonmember.reservationDetail.reservationInfo.currency', '원')}</div>
              </div>
              <div>
                <div className={styles.label}>{t('nonmember.reservationDetail.reservationInfo.serviceFee', '서비스 수수료')}</div>
                <div className={styles.feeText}>
                  {(reservationInfo.quantity * 1000).toLocaleString()}{t('nonmember.reservationDetail.reservationInfo.currency', '원')}
                </div>
              </div>
              <div>
                <div className={styles.label}>{t('nonmember.reservationDetail.reservationInfo.totalAmount', '총 결제금액')}</div>
                <div className={styles.totalPriceText}>
                  {((reservationInfo.ticketPrice * reservationInfo.quantity) + (reservationInfo.quantity * 1000)).toLocaleString()}{t('nonmember.reservationDetail.reservationInfo.currency', '원')}
                </div>
              </div>
            </div>
          </section>

          {/* 우하단 - 결제 정보 */}
          {reservationData?.paymentInfo && (
            <section className={styles.gridSection}>
              <h3 className={styles.subTitle}>{t('nonmember.reservationDetail.sections.paymentInfo', '결제 정보')}</h3>
              <div className={styles.paymentGrid}>
                <div>
                  <div className={styles.label}>{t('nonmember.reservationDetail.paymentInfo.paymentMethod', '결제방법')}</div>
                  <div>{formatPaymentMethod(reservationData.paymentInfo.paymentMethod)}</div>
                </div>
                {reservationData.paymentInfo.paymentDetail && (
                  <div>
                    <div className={styles.label}>{t('nonmember.reservationDetail.paymentInfo.paymentDetail', '결제수단')}</div>
                    <div>{reservationData.paymentInfo.paymentDetail}</div>
                  </div>
                )}
                <div>
                  <div className={styles.label}>{t('nonmember.reservationDetail.paymentInfo.totalAmount', '총 결제금액')}</div>
                  <div className={styles.priceText}>
                    {reservationData.paymentInfo.totalAmount?.toLocaleString()}{t('nonmember.reservationDetail.reservationInfo.currency', '원')}
                  </div>
                </div>
                {reservationData.paymentInfo.paidAt && (
                  <div>
                    <div className={styles.label}>{t('nonmember.reservationDetail.paymentInfo.paidAt', '결제일시')}</div>
                    <div>{new Date(reservationData.paymentInfo.paidAt).toLocaleString('ko-KR')}</div>
                  </div>
                )}
              </div>
            </section>
          )}
          </div>
        </div>
      </div>

      <QRModal
        open={qrModalOpen}
        onClose={() => {
          setQrModalOpen(false);
          setSelectedReserver(null);
        }}
        qrImgUrl={qrImgUrl}
        expoInfo={expoInfo}
        reservationInfo={reservationInfo}
        reserver={selectedReserver}
      />
    </div>
  );
};

export default NonMemberReservationDetailPage;