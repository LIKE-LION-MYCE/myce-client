import React, { useState, useMemo } from 'react';
import { FiCalendar, FiClock, FiMapPin } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import styles from './ExpoEvents.module.css';

const ExpoEvents = ({ events, formatDate, formatTime }) => {
  const { t } = useTranslation();
  const [eventFilter, setEventFilter] = useState('all');

  // 이벤트 필터링 로직
  const filteredEvents = useMemo(() => {
    if (!events || events.length === 0) return [];
    
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD 형태
    
    return events.filter(event => {
      if (!event.eventDate) return true; // eventDate가 없으면 모든 필터에 포함
      
      // eventDate가 문자열인 경우를 고려
      const eventDateStr = typeof event.eventDate === 'string' 
        ? event.eventDate.split('T')[0] 
        : new Date(event.eventDate).toISOString().split('T')[0];
      
      switch (eventFilter) {
        case 'past':
          return eventDateStr < todayStr;
        case 'today':
          return eventDateStr === todayStr;
        case 'upcoming':
          return eventDateStr > todayStr;
        default:
          return true;
      }
    });
  }, [events, eventFilter]);
  return (
    <div className={styles.eventsSection}>
      <div className={styles.eventsHeader}>
        <h3>{t('expoDetail.expoEvents.title', '이벤트 정보')}</h3>
        <div className={styles.filterButtons}>
          <button 
            className={`${styles.filterBtn} ${eventFilter === 'all' ? styles.active : ''}`}
            onClick={() => setEventFilter('all')}
          >
            {t('expoDetail.expoEvents.filters.all', '전체')}
          </button>
          <button 
            className={`${styles.filterBtn} ${eventFilter === 'past' ? styles.active : ''}`}
            onClick={() => setEventFilter('past')}
          >
            {t('expoDetail.expoEvents.filters.past', '지난 행사')}
          </button>
          <button 
            className={`${styles.filterBtn} ${eventFilter === 'today' ? styles.active : ''}`}
            onClick={() => setEventFilter('today')}
          >
            {t('expoDetail.expoEvents.filters.today', '오늘 행사')}
          </button>
          <button 
            className={`${styles.filterBtn} ${eventFilter === 'upcoming' ? styles.active : ''}`}
            onClick={() => setEventFilter('upcoming')}
          >
            {t('expoDetail.expoEvents.filters.upcoming', '다가오는 행사')}
          </button>
        </div>
      </div>
      {filteredEvents && filteredEvents.length > 0 ? (
        <div className={styles.eventsList}>
          {filteredEvents.map((event) => (
            <div key={event.id} className={styles.eventCard}>
              <div className={styles.eventMainInfo}>
                <div className={styles.eventHeader}>
                  <h4>{event.name}</h4>
                </div>
                <div className={styles.eventDateTime}>
                  {event.location && (
                    <div className={styles.eventLocation}>
                      <FiMapPin size={16} />
                      {event.location}
                    </div>
                  )}
                  <div className={styles.eventDate}>
                    <FiCalendar size={16} />
                    {formatDate(event.eventDate)}
                  </div>
                  <div className={styles.eventTime}>
                    <FiClock size={16} />
                    {formatTime(event.startTime)} - {formatTime(event.endTime)}
                  </div>
                </div>
                <div className={styles.eventDescription}>
                  {event.description || t('expoDetail.expoEvents.noDescription', '이벤트 설명이 없습니다.')}
                </div>
              </div>
              
              <div className={styles.contactInfo}>
                {event.contactName && (
                  <div className={styles.contactName}>
                    {t('expoDetail.expoEvents.contact', '담당자')}: {event.contactName}
                  </div>
                )}
                {event.contactEmail && (
                  <div className={styles.contactEmail}>
                    {t('expoDetail.expoEvents.email', '이메일')}: {event.contactEmail}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.emptyMessage}>
          {eventFilter === 'all' ? t('expoDetail.expoEvents.noEvents.all', '등록된 이벤트가 없습니다.') : 
           eventFilter === 'past' ? t('expoDetail.expoEvents.noEvents.past', '지난 행사가 없습니다.') :
           eventFilter === 'today' ? t('expoDetail.expoEvents.noEvents.today', '오늘 예정된 행사가 없습니다.') :
           t('expoDetail.expoEvents.noEvents.upcoming', '다가오는 행사가 없습니다.')}
        </p>
      )}
    </div>
  );
};

export default ExpoEvents;