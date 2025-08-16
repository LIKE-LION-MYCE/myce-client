// QRModal.js
import React, { useState } from "react";
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
  const [congestionModalOpen, setCongestionModalOpen] = useState(false);

  if (!open) return null;

  // 날짜 포맷 함수
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('ko-KR');
  };

  const formatDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return 'N/A';
    const start = formatDate(startDate);
    const end = formatDate(endDate);
    return `${start} ~ ${end}`;
  };

  const formatTimeRange = (startTime, endTime) => {
    if (!startTime || !endTime) return 'N/A';
    return `${startTime} ~ ${endTime}`;
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
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>개최 기간</span>
                  <span className={styles.infoValue}>
                    {formatDateRange(expoInfo?.startDate, expoInfo?.endDate)}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>운영 시간</span>
                  <span className={styles.infoValue}>
                    {formatTimeRange(expoInfo?.startTime, expoInfo?.endTime)}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>장소</span>
                  <span className={styles.infoValue}>
                    {expoInfo?.location}
                  </span>
                </div>
                {expoInfo?.locationDetail && (
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>상세 위치</span>
                    <span className={styles.infoValue}>
                      {expoInfo.locationDetail}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.ticketInfo}>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>참여자</span>
                  <span className={styles.infoValue}>{reserver?.name}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>예매번호</span>
                  <span className={styles.infoValue}>{reservationInfo?.reservationCode}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>예매일</span>
                  <span className={styles.infoValue}>{formatDate(reservationInfo?.createdAt)}</span>
                </div>
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
                <img src={qrImgUrl} alt="QR 코드" className={styles.qrImg} />
              </div>
              <p className={styles.qrDesc}>입장 시 QR코드를 제시해주세요</p>
            </div>
          </div>
        </div>

        {/* 상세 티켓 정보 */}
        <div className={styles.ticketDetails}>
          <h4 className={styles.detailsTitle}>티켓 상세 정보</h4>
          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>티켓명</span>
              <span className={styles.detailValue}>{reservationInfo?.ticketName || 'N/A'}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>티켓 타입</span>
              <span className={styles.detailValue}>
                {reservationInfo?.ticketType === 'GENERAL' ? '일반' : 
                 reservationInfo?.ticketType === 'EARLY_BIRD' ? '얼리버드' : 
                 reservationInfo?.ticketType || 'N/A'}
              </span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>사용 시작일</span>
              <span className={styles.detailValue}>{formatDate(reservationInfo?.ticketUseStartDate)}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>사용 종료일</span>
              <span className={styles.detailValue}>{formatDate(reservationInfo?.ticketUseEndDate)}</span>
            </div>
          </div>
        </div>

        {/* 티켓 푸터 */}
        <div className={styles.ticketFooter}>
          <button 
            className={styles.congestionBtn}
            onClick={() => setCongestionModalOpen(true)}
          >
            실시간 혼잡도 조회
          </button>
          <button className={styles.saveBtn} onClick={handleSaveQR}>
            QR코드 저장
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