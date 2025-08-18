import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import styles from "./NonMemberReservationDetailPage.module.css";
import QRModal from "../../../mypage/components/qrModal/QRModal";

const NonMemberReservationDetailPage = () => {
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
      setError('예매 정보를 찾을 수 없습니다.');
      setTimeout(() => {
        navigate('/non-member/reservation-check');
      }, 2000);
    }
  }, [location.state, navigate]);

  // QR 모달 열기
  const handleQrOpen = (qrUrl, reserver) => {
    if (qrUrl) {
      setQrImgUrl(qrUrl);
      setSelectedReserver(reserver);
      setQrModalOpen(true);
    }
  };

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
  };

  // 박람회 진행 중인지 확인
  const isExpoActive = () => {
    if (!reservationData?.expoInfo) return false;
    const now = new Date();
    const startDate = new Date(reservationData.expoInfo.displayStartDate);
    const endDate = new Date(reservationData.expoInfo.displayEndDate);
    return now >= startDate && now <= endDate;
  };

  // 날짜 범위 포맷팅
  const formatDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return 'N/A';
    const start = formatDate(startDate);
    const end = formatDate(endDate);
    return `${start} ~ ${end}`;
  };

  // 시간 범위 포맷팅
  const formatTimeRange = (startTime, endTime) => {
    if (!startTime || !endTime) return 'N/A';
    return `${startTime} ~ ${endTime}`;
  };

  // 티켓 타입 한글 변환
  const formatTicketType = (ticketType) => {
    const typeMap = {
      'GENERAL': '일반',
      'EARLY_BIRD': '얼리버드'
    };
    return typeMap[ticketType] || ticketType;
  };

  // 결제 방법 한글 변환
  const formatPaymentMethod = (method) => {
    const methodMap = {
      'CARD': '카드',
      'BANK_TRANSFER': '계좌이체',
      'VIRTUAL_ACCOUNT': '가상계좌',
      'SIMPLE_PAY': '간편결제'
    };
    return methodMap[method] || method;
  };

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.mainContent}>
            <h2 className={styles.pageTitle}>예매 정보 확인</h2>
            <div className={styles.loading}>로딩 중...</div>
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
            <h2 className={styles.pageTitle}>예매 정보 확인</h2>
            <div className={styles.error}>{error || '예매 정보를 찾을 수 없습니다.'}</div>
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
          <h2 className={styles.pageTitle}>예매 정보 확인</h2>
          
          <div className={styles.contentGrid}>
          {/* 좌상단 - 박람회 정보 */}
          <section className={styles.gridSection}>
            <h3 className={styles.subTitle}>박람회 정보</h3>
            <div className={styles.expoBox}>
              {expoInfo.thumbnailUrl && (
                <img 
                  src={expoInfo.thumbnailUrl} 
                  alt="박람회 썸네일" 
                  className={styles.poster} 
                />
              )}
              <div className={styles.expoDetails}>
                <h4 className={styles.expoTitle}>{expoInfo.title}</h4>
                <div className={styles.eventPlace}>
                  장소: {expoInfo.location} {expoInfo.locationDetail}
                </div>
                <div className={styles.eventDate}>
                  일정: {formatDateRange(expoInfo.startDate, expoInfo.endDate)}
                </div>
                <div className={styles.eventDate}>
                  시간: {formatTimeRange(expoInfo.startTime, expoInfo.endTime)}
                </div>
              </div>
            </div>
          </section>

          {/* 우상단 - 티켓 사용 안내 */}
          <section className={styles.gridSection}>
            <h3 className={styles.subTitle}>티켓 사용 안내</h3>
            <div className={styles.ticketGuide}>
              <div>
                <div className={styles.label}>사용 가능 기간</div>
                <div>{formatDateRange(reservationInfo.ticketUseStartDate, reservationInfo.ticketUseEndDate)}</div>
              </div>
              <div className={styles.guideText}>
                • 입장 시 QR코드를 제시해주세요.<br/>
                • 티켓 사용 기간을 확인해주세요.<br/>
                • 분실 시 재발급이 어려우니 주의하세요.
              </div>
            </div>
          </section>

          {/* 중단 전체 - 참여 인원 */}
          <section className={`${styles.gridSection} ${styles.fullWidthMiddle}`}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.subTitle}>참여 인원</h3>
            </div>
            <table className={styles.memberTable}>
              <thead>
                <tr>
                  <th>이름</th>
                  <th>예매번호</th>
                  <th>성별</th>
                  <th>전화번호</th>
                  <th>이메일</th>
                  <th>QR코드</th>
                </tr>
              </thead>
              <tbody>
                {reserverInfos?.map((member, idx) => (
                  <tr key={idx}>
                    <td>{member.name || 'N/A'}</td>
                    <td>{reservationInfo.reservationCode || 'N/A'}</td>
                    <td>{member.gender === 'MALE' ? '남자' : member.gender === 'FEMALE' ? '여자' : 'N/A'}</td>
                    <td>{member.phone || 'N/A'}</td>
                    <td>{member.email || 'N/A'}</td>
                    <td>
                      <button
                        className={`${styles.qrBtn} ${!isExpoActive() ? styles.qrBtnDisabled : ''}`}
                        onClick={() => handleQrOpen(member.qrCodeUrl, member)}
                        disabled={!isExpoActive()}
                      >
                        {isExpoActive() ? '상세보기' : '기간 외'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* 좌하단 - 예매 정보 */}
          <section className={styles.gridSection}>
            <h3 className={styles.subTitle}>예매 정보</h3>
            <div className={styles.reservationInfoGrid}>
              <div>
                <div className={styles.label}>예매일</div>
                <div>{formatDate(reservationInfo.createdAt)}</div>
              </div>
              <div>
                <div className={styles.label}>티켓 이름</div>
                <div>{reservationInfo.ticketName || 'N/A'}</div>
              </div>
              <div>
                <div className={styles.label}>티켓 타입</div>
                <div>{formatTicketType(reservationInfo.ticketType) || 'N/A'}</div>
              </div>
              <div>
                <div className={styles.label}>티켓 장수</div>
                <div>{reservationInfo.quantity}매</div>
              </div>
              <div>
                <div className={styles.label}>단가</div>
                <div>{reservationInfo.ticketPrice?.toLocaleString()}원</div>
              </div>
              <div>
                <div className={styles.label}>서비스 수수료</div>
                <div className={styles.feeText}>
                  {(reservationInfo.quantity * 1000).toLocaleString()}원
                </div>
              </div>
              <div>
                <div className={styles.label}>총 결제금액</div>
                <div className={styles.totalPriceText}>
                  {((reservationInfo.ticketPrice * reservationInfo.quantity) + (reservationInfo.quantity * 1000)).toLocaleString()}원
                </div>
              </div>
            </div>
          </section>

          {/* 우하단 - 결제 정보 */}
          {reservationData?.paymentInfo && (
            <section className={styles.gridSection}>
              <h3 className={styles.subTitle}>결제 정보</h3>
              <div className={styles.paymentGrid}>
                <div>
                  <div className={styles.label}>결제방법</div>
                  <div>{formatPaymentMethod(reservationData.paymentInfo.paymentMethod)}</div>
                </div>
                {reservationData.paymentInfo.paymentDetail && (
                  <div>
                    <div className={styles.label}>결제수단</div>
                    <div>{reservationData.paymentInfo.paymentDetail}</div>
                  </div>
                )}
                <div>
                  <div className={styles.label}>총 결제금액</div>
                  <div className={styles.priceText}>
                    {reservationData.paymentInfo.totalAmount?.toLocaleString()}원
                  </div>
                </div>
                {reservationData.paymentInfo.paidAt && (
                  <div>
                    <div className={styles.label}>결제일시</div>
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