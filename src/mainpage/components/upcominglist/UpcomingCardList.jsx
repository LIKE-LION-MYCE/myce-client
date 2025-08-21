import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './UpcomingCardList.module.css';
import UpcomingCard from '../upcomingcard/UpcomingCard';
import { getPendingPublishExpos } from '../../../api/service/user/expoApi';
import LoadingSpinner from '../../../components/shared/LoadingSpinner';
import '../../../i18n/i18n_homepage.js'; // homepage용 i18n 파일 import

const UpcomingCardList = ({ 
  events: propEvents, 
  loading: propLoading = false, 
  error: propError = null
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [expos, setExpos] = useState([]);
  const [loading, setLoading] = useState(propLoading);
  const [error, setError] = useState(propError);

  useEffect(() => {
    if (!propEvents) {
      fetchPendingExpos();
    }
  }, [propEvents]);

  const fetchPendingExpos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPendingPublishExpos();
      
      // 백엔드 데이터를 기존 카드 형식에 맞게 변환
      let transformedExpos = [];
      
      if (data.content && Array.isArray(data.content)) {
        transformedExpos = data.content.map(expo => ({
          id: expo.expoId || expo.expo_id,
          title: expo.title,
          image: expo.thumbnailImageUrl || expo.thumbnail_url || expo.thumbnailUrl || "https://picsum.photos/300/400?random=" + (expo.expoId || expo.expo_id),
          date: formatExpoDate(expo.startDate || expo.start_date, expo.endDate || expo.end_date),
          location: expo.location,
          category: expo.category || t("homepage.upcoming.defaultCategory", "박람회")
        }));
      } else if (Array.isArray(data)) {
        transformedExpos = data.map(expo => ({
          id: expo.expoId || expo.expo_id,
          title: expo.title,
          image: expo.thumbnailImageUrl || expo.thumbnail_url || expo.thumbnailUrl || "https://picsum.photos/300/400?random=" + (expo.expoId || expo.expo_id),
          date: formatExpoDate(expo.startDate || expo.start_date, expo.endDate || expo.end_date),
          location: expo.location,
          category: expo.category || t("homepage.upcoming.defaultCategory", "박람회")
        }));
      }
      setExpos(transformedExpos);
    } catch (err) {
      console.error("Failed to fetch pending publish expos:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const formatExpoDate = (startDate, endDate) => {
    if (!startDate) return t("homepage.upcoming.dateUndetermined", "날짜 미정");
    
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;
    
    const formatDate = (date) => {
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const weekdays = [
        t("homepage.upcoming.weekdays.sun", "일"),
        t("homepage.upcoming.weekdays.mon", "월"), 
        t("homepage.upcoming.weekdays.tue", "화"),
        t("homepage.upcoming.weekdays.wed", "수"),
        t("homepage.upcoming.weekdays.thu", "목"),
        t("homepage.upcoming.weekdays.fri", "금"),
        t("homepage.upcoming.weekdays.sat", "토")
      ];
      const weekday = weekdays[date.getDay()];
      return `${month}.${day}(${weekday})`;
    };
    
    if (end && start.toDateString() !== end.toDateString()) {
      return `${formatDate(start)} - ${formatDate(end)}`;
    }
    return formatDate(start);
  };

  const events = propEvents || expos;

  const handleEventClick = (event) => {
    console.log('Event clicked:', event);
    if (event.id) {
      navigate(`/detail/${event.id}`);
    }
  };

  const handleViewAll = () => {
    console.log('View all upcoming events clicked');
    // 오픈 예정 상태로 필터링된 전체보기 페이지로 이동
    navigate('/expo-list?status=PENDING_PUBLISH');
  };

  // 로딩 상태
  if (loading) {
    return (
      <div className={styles.container}>
        <LoadingSpinner 
          size="medium" 
          message={t("homepage.upcoming.loading", "이벤트를 불러오는 중...")} 
        />
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <div className={styles.errorIcon}>⚠️</div>
          <div>{t("homepage.upcoming.error", "이벤트를 불러오는데 실패했습니다.")}</div>
          <div style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
            {error.message || t("homepage.upcoming.errorRetry", "잠시 후 다시 시도해주세요.")}
          </div>
        </div>
      </div>
    );
  }

  // 빈 상태
  if (!events || events.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>🎭</div>
          <div className={styles.emptyTitle}>{t("homepage.upcoming.noEvents", "예정된 이벤트가 없습니다")}</div>
          <div className={styles.emptyDescription}>
            {t("homepage.upcoming.noEventsDesc", "새로운 이벤트가 추가되면 알려드리겠습니다.")}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* 섹션 헤더 */}
      <div className={styles.sectionHeader}>
        <div>
          <h2 className={styles.title}>{t("homepage.upcoming.title", "오픈 예정")}</h2>
          <p className={styles.subtitle}>{t("homepage.upcoming.subtitleNew", "곧 개최될 박람회를 소개합니다")}</p>
        </div>
      </div>
      
      {/* 이벤트 카드 그리드 */}
      <div className={styles.grid}>
        {events.map((event) => (
          <UpcomingCard
            key={event.id}
            event={event}
            onClick={handleEventClick}
          />
        ))}
      </div>
      
      {/* 더보기 버튼 */}
      <div className={styles.buttonContainer}>
        <button 
          onClick={handleViewAll}
          className={styles.viewAllButton}
        >
전체보기
          <svg className={styles.arrowIcon} viewBox="0 0 24 24">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default UpcomingCardList;