import { FiBookmark, FiMapPin, FiClock, FiUsers, FiCalendar, FiMessageCircle } from 'react-icons/fi';
import { MdBookmark } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import TicketDropdown from '../ticketdropdown/ticketDropdown'; // Fixed case sensitivity: ticketDropDown -> ticketDropdown
import styles from './ExpoHeader.module.css';
import '../../../i18n/i18n_expodetail.js'; // expodetail용 i18n 파일 import

const ExpoHeader = ({ 
  basicInfo, 
  bookmarkStatus, 
  tickets,
  selectedTicketId,
  onTicketSelect,
  onPurchase,
  onBookmarkToggle,
  onChatStart,
  formatDate,
  formatTime,
  loading 
}) => {
  const { t } = useTranslation();
  return (
    <div className={styles.header}>
      <div className={styles.imageSection}>
        <img 
          src={basicInfo.thumbnailUrl} 
          alt={basicInfo.title}
          className={styles.thumbnail}
          onError={(e) => {
            e.target.src = 'https://flexible.img.hani.co.kr/flexible/normal/590/590/imgdb/resize/2007/1227/68227042_20071227.jpg';
          }}
        />
      </div>
      
      <div className={styles.infoSection}>
        <div className={styles.infoContent}>
          <div className={styles.topSection}>
            <div className={styles.categories}>
              {basicInfo.categories?.map((category, index) => (
                <span key={index} className={styles.category}>{category}</span>
              ))}
            </div>
            
            <button 
              className={styles.bookmarkBtn}
              onClick={onBookmarkToggle}
              title={bookmarkStatus?.isBookmarked ? t('expoDetail.expoHeader.buttons.bookmarkRemove', '북마크 제거') : t('expoDetail.expoHeader.buttons.bookmarkAdd', '북마크 추가')}
            >
              {bookmarkStatus?.isBookmarked ? (
                <MdBookmark size={24} style={{ color: '#d32f2f' }} />
              ) : (
                <FiBookmark size={24} />
              )}
            </button>
          </div>

          <div className={styles.titleSection}>
            <h1 className={styles.title}>{basicInfo.title}</h1>
          </div>
          
          <div className={styles.basicDetails}>
            <div className={styles.detailItem}>
              <FiCalendar className={styles.icon}/>
              <span>{formatDate(basicInfo.startDate)} ~ {formatDate(basicInfo.endDate)}</span>
            </div>

            <div className={styles.detailItem}>
              <FiClock className={styles.icon}/>
              <span>{formatTime(basicInfo.startTime)} ~ {formatTime(basicInfo.endTime)}</span>
            </div>
            
            <div className={styles.detailItem}>
              <FiMapPin className={styles.icon} />
              <span>{basicInfo.location} {basicInfo.locationDetail}</span>
            </div>
            
            <div className={styles.detailItem}>
              <FiUsers className={styles.icon} />
              <span>{t('expoDetail.expoHeader.currentReservations', '현재 {{count}}명 예약', { count: basicInfo.currentReservationCount?.toLocaleString() || 0 })}</span>
            </div>
          </div>

          {/* 1:1 상담하기 버튼을 현재 예약 밑으로 이동 */}
          <div className={styles.chatButtonWrapper}>
            <button 
              className={styles.chatButton}
              onClick={onChatStart}
              disabled={loading}
              title={t('expoDetail.expoHeader.buttons.consultationTitle', '1:1 상담 채팅')}
            >
              <FiMessageCircle className={styles.chatIcon} />
              <span>{t('expoDetail.expoHeader.buttons.consultation', '1:1 상담하기')}</span>
            </button>
          </div>
        </div>
        
        {/* 액션 버튼 영역 */}
        <div className={styles.actionSection}>
          {/* 티켓 드롭다운 컴포넌트 */}
          <TicketDropdown
            tickets={tickets}
            selectedTicketId={selectedTicketId}
            onTicketSelect={onTicketSelect}
            onPurchase={onPurchase}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default ExpoHeader;