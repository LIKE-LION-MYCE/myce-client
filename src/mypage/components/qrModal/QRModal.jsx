// QRModal.js
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./QRModal.module.css";
import CongestionModal from "../../../components/modal/CongestionModal/CongestionModal";
import { getCongestionData } from "../../../api/service/user/expoApi";

const QRModal = ({ 
  open, 
  onClose, 
  qrImgUrl,
  expoInfo,
  reservationInfo,
  reserver
}) => {
  const { t } = useTranslation();
  const [congestionModalOpen, setCongestionModalOpen] = useState(false);

  if (!open) return null;

  // 날짜 포맷 함수
  const formatDate = (date) => {
    if (!date) return t('qrModal.common.notAvailable', 'N/A');
    return new Date(date).toLocaleDateString('ko-KR');
  };

  const formatDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return t('qrModal.common.notAvailable', 'N/A');
    const start = formatDate(startDate);
    const end = formatDate(endDate);
    return `${start} ~ ${end}`;
  };

  const formatTimeRange = (startTime, endTime) => {
    if (!startTime || !endTime) return t('qrModal.common.notAvailable', 'N/A');
    return `${startTime} ~ ${endTime}`;
  };

  // QR 상태 한글 변환
  const formatQrStatus = (status) => {
    const statusMap = {
      'ACTIVE': t('qrModal.qrStatus.active', '사용 가능'),
      'USED': t('qrModal.qrStatus.used', '사용됨'),
      'EXPIRED': t('qrModal.qrStatus.expired', '만료됨'),
      'APPROVED': t('qrModal.qrStatus.approved', '활성화 대기')
    };
    return statusMap[status] || status;
  };

  // QR 상태에 따른 스타일 클래스
  const getQrStatusClass = (status) => {
    switch(status) {
      case 'ACTIVE':
        return styles.statusActive;
      case 'APPROVED':
        return styles.statusApproved;
      case 'USED':
        return styles.statusUsed;
      case 'EXPIRED':
        return styles.statusExpired;
      default:
        return styles.statusDefault;
    }
  };

  const handleSaveQR = () => {
    // QR 코드 이미지 다운로드 로직
    const link = document.createElement('a');
    link.href = qrImgUrl;
    link.download = `QR_${reserver?.name || 'ticket'}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.ticketModal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          ×
        </button>
        
        {/* 티켓 헤더 */}
        <div className={styles.ticketHeader}>
          <h2 className={styles.ticketTitle}>입장권</h2>
          <div className={styles.ticketSubtitle}>ADMISSION TICKET</div>
        </div>

        {/* 티켓 바디 */}
        <div className={styles.ticketBody}>
          {/* 왼쪽 정보 섹션 */}
          <div className={styles.leftSection}>
            <div className={styles.expoInfo}>
              <h3 className={styles.expoTitle}>{expoInfo?.title}</h3>
            </div>

            <div className={styles.ticketDetails}>
              <h4 className={styles.detailsTitle}>티켓 상세 정보</h4>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>{t('qrModal.ticketInfo.ticketName', '티켓명')}</span>
                  <span className={styles.infoValue}>{reservationInfo?.ticketName || t('qrModal.common.notAvailable', 'N/A')}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>{t('qrModal.ticketInfo.ticketType', '티켓 타입')}</span>
                  <span className={styles.infoValue}>
                    {reservationInfo?.ticketType === 'GENERAL' ? t('qrModal.ticketTypes.general', '일반') : 
                     reservationInfo?.ticketType === 'EARLY_BIRD' ? t('qrModal.ticketTypes.earlyBird', '얼리버드') : 
                     reservationInfo?.ticketType || t('qrModal.common.notAvailable', 'N/A')}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>{t('qrModal.ticketInfo.usageStartDate', '사용 시작일')}</span>
                  <span className={styles.infoValue}>{formatDate(reservationInfo?.ticketUseStartDate)}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>{t('qrModal.ticketInfo.usageEndDate', '사용 종료일')}</span>
                  <span className={styles.infoValue}>{formatDate(reservationInfo?.ticketUseEndDate)}</span>
                </div>
              </div>
            </div>

            <div className={styles.ticketInfo}>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>{t('qrModal.participantInfo.participant', '참여자')}</span>
                  <span className={styles.infoValue}>{reserver?.name}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>{t('qrModal.participantInfo.reservationNumber', '예매번호')}</span>
                  <span className={styles.infoValue}>{reservationInfo?.reservationCode}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>{t('qrModal.participantInfo.reservationDate', '예매일')}</span>
                  <span className={styles.infoValue}>{formatDate(reservationInfo?.createdAt)}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>{t('qrModal.participantInfo.qrStatus', 'QR 상태')}</span>
                  <span className={`${styles.infoValue} ${getQrStatusClass(reserver?.qrStatus)}`}>
                    {formatQrStatus(reserver?.qrStatus)}
                  </span>
                </div>
                {reserver?.qrUsedAt && (
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>{t('qrModal.participantInfo.usageDateTime', '사용일시')}</span>
                    <span className={styles.infoValue}>
                      {new Date(reserver.qrUsedAt).toLocaleString('ko-KR')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 구분선 */}
          <div className={styles.divider}>
            <div className={styles.dividerLine}></div>
            <div className={styles.dividerCircles}>
              <div className={styles.circle}></div>
              <div className={styles.circle}></div>
              <div className={styles.circle}></div>
            </div>
          </div>

          {/* 오른쪽 QR 섹션 */}
          <div className={styles.rightSection}>
            <div className={styles.qrContainer}>
              <div className={styles.qrBox}>
                <img src={qrImgUrl} alt={t('qrModal.qr.altText', 'QR 코드')} className={styles.qrImg} />
              </div>
              <p className={styles.qrDesc}>{t('qrModal.qr.description', '입장 시 QR코드를 제시해주세요')}</p>
            </div>
          </div>
        </div>


        {/* 티켓 푸터 */}
        <div className={styles.ticketFooter}>
          <button 
            className={styles.congestionBtn}
            onClick={() => setCongestionModalOpen(true)}
          >
            {t('qrModal.buttons.congestionCheck', '실시간 혼잡도 조회')}
          </button>
          <button className={styles.saveBtn} onClick={handleSaveQR}>
            {t('qrModal.buttons.saveQr', 'QR코드 저장')}
          </button>
        </div>

        {/* 혼잡도 모달 */}
        <CongestionModal
          isOpen={congestionModalOpen}
          onClose={() => setCongestionModalOpen(false)}
          expoId={expoInfo?.expoId}
          getCongestionData={getCongestionData}
        />
      </div>
    </div>
  );
};

export default QRModal;