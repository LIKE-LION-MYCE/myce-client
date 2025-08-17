import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './UpcomingCardList.module.css';
import UpcomingCard from '../upcomingcard/UpcomingCard';
import { getPendingPublishExpos } from '../../../api/service/user/expoApi';

const UpcomingCardList = ({ 
  events: propEvents, 
  loading: propLoading = false, 
  error: propError = null
}) => {
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
      
      console.log("Pending publish expos API response:", data);
      
      // 백엔드 데이터를 기존 카드 형식에 맞게 변환
      let transformedExpos = [];
      
      if (data.content && Array.isArray(data.content)) {
        transformedExpos = data.content.map(expo => ({
          id: expo.expoId || expo.expo_id,
          title: expo.title,
          image: expo.thumbnailImageUrl || expo.thumbnail_url || "https://picsum.photos/300/400?random=" + (expo.expoId || expo.expo_id),
          date: formatExpoDate(expo.startDate || expo.start_date, expo.endDate || expo.end_date),
          location: expo.location,
          category: expo.category || "박람회"
        }));
      } else if (Array.isArray(data)) {
        transformedExpos = data.map(expo => ({
          id: expo.expoId || expo.expo_id,
          title: expo.title,
          image: expo.thumbnailImageUrl || expo.thumbnail_url || "https://picsum.photos/300/400?random=" + (expo.expoId || expo.expo_id),
          date: formatExpoDate(expo.startDate || expo.start_date, expo.endDate || expo.end_date),
          location: expo.location,
          category: expo.category || "박람회"
        }));
      }
      
      console.log("Transformed expos:", transformedExpos);
      setExpos(transformedExpos);
    } catch (err) {
      console.error("Failed to fetch pending publish expos:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const formatExpoDate = (startDate, endDate) => {
    if (!startDate) return "날짜 미정";
    
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;
    
    const formatDate = (date) => {
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const weekday = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
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
    console.log('View all events clicked');
    // 전체보기 페이지로 이동
  };

  // 로딩 상태
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          <div>이벤트를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <div className={styles.errorIcon}>⚠️</div>
          <div>이벤트를 불러오는데 실패했습니다.</div>
          <div style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
            {error.message || '잠시 후 다시 시도해주세요.'}
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
          <div className={styles.emptyTitle}>예정된 이벤트가 없습니다</div>
          <div className={styles.emptyDescription}>
            새로운 이벤트가 추가되면 알려드리겠습니다.
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
          <h2 className={styles.title}>오픈 예정</h2>
          <p className={styles.subtitle}>곧 시작될 흥미진진한 이벤트들을 만나보세요</p>
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
          오픈 예정 공연 전체보기
          <svg className={styles.arrowIcon} viewBox="0 0 24 24">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default UpcomingCardList;