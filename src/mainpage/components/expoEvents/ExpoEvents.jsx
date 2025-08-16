import React from 'react';
import { FiCalendar, FiClock, FiMapPin } from 'react-icons/fi';
import styles from './ExpoEvents.module.css';

const ExpoEvents = ({ events, formatDate, formatTime }) => {
  return (
    <div className={styles.eventsSection}>
      <h3>이벤트 정보</h3>
      {events && events.length > 0 ? (
        <div className={styles.eventsList}>
          {events.map((event) => (
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
                  {event.description || '이벤트 설명이 없습니다.'}
                </div>
              </div>
              
              <div className={styles.contactInfo}>
                {event.contactName && (
                  <div className={styles.contactName}>
                    담당자: {event.contactName}
                  </div>
                )}
                {event.contactPhone && (
                  <div className={styles.contactPhone}>
                    연락처: {event.contactPhone}
                  </div>
                )}
                {event.contactEmail && (
                  <div className={styles.contactEmail}>
                    이메일: {event.contactEmail}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>등록된 이벤트가 없습니다.</p>
      )}
    </div>
  );
};

export default ExpoEvents;