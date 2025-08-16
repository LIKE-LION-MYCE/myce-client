import { FiBookmark, FiBookmark as FiBookmarkFill, FiMapPin, FiClock, FiUsers, FiCalendar } from 'react-icons/fi';
import TicketDropdown from '../ticketdropdown/ticketDropdown'; // Fixed case sensitivity: ticketDropDown -> ticketDropdown
import styles from './ExpoHeader.module.css';

const ExpoHeader = ({ 
  basicInfo, 
  bookmarkStatus, 
  tickets,
  selectedTicketId,
  onTicketSelect,
  onPurchase,
  onBookmarkToggle,
  formatDate,
  formatTime,
  loading 
}) => {
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
            
            {bookmarkStatus && (
              <button 
                className={styles.bookmarkBtn}
                onClick={onBookmarkToggle}
              >
                {bookmarkStatus.isBookmarked ? (
                  <FiBookmarkFill size={20} />
                ) : (
                  <FiBookmark size={20} />
                )}
              </button>
            )}
          </div>

          <h1 className={styles.title}>{basicInfo.title}</h1>
          
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
              <span>현재 {basicInfo.currentReservationCount?.toLocaleString()}명 예약</span>
            </div>
          </div>
        </div>
        
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
  );
};

export default ExpoHeader;