import styles from './UpcomingCardList.module.css';
import UpcomingCard from '../upcomingcard/UpcomingCard';

const UpcomingCardList = ({ 
  events: propEvents, 
  loading = false, 
  error = null
}) => {
  // 기본 데이터 (props로 전달되지 않은 경우)
  const defaultEvents = [
    {
      id: 1,
      category: "추후공지",
      title: "월드 오브 스테일 올림 파이터 [THE REAL STAGE] TOUR - 울산",
      image: "https://picsum.photos/300/400?random=1",
    },
    {
      id: 2,
      date: "08.20(수) 20:00",
      title: "XIUMIN FAN CONCERT X Times ( ) ∞ ENCORE",
      image: "https://picsum.photos/300/400?random=2",
      location: "서울 올림픽공원",
    },
    {
      id: 3,
      date: "08.22(금) 18:00",
      title: "램페라트리스 내한공연 (L'Imperatrice PULSAR ASIA...)",
      image: "https://picsum.photos/300/400?random=3",
      location: "서울 예스24 라이브홀",
    },
    {
      id: 4,
      date: "08.21(목) 20:00",
      title: "[Play&Stay] 2025 ZEROBASEONE WORLD TOUR",
      image: "https://picsum.photos/300/400?random=4",
      location: "고척스카이돔",
    },
    {
      id: 5,
      date: "08.25(월) 20:00",
      title: "2025-26 TREASURE TOUR [PULSE ON] IN SEOUL",
      image: "https://picsum.photos/300/400?random=5",
      location: "잠실실내체육관",
    },
    {
      id: 6,
      date: "09.19(금) 14:00",
      title: "ENHYPEN WORLD TOUR 'WALK THE LINE' : FINAL",
      image: "https://picsum.photos/300/400?random=6",
      location: "KSPO DOME",
    },
    {
      id: 7,
      date: "09.05(목) 19:30",
      title: "아이유 2025 CONCERT [The Golden Hour]",
      image: "https://picsum.photos/300/400?random=7",
      location: "서울 올림픽공원 체조경기장",
    },
    {
      id: 8,
      date: "09.12(금) 20:00",
      title: "NewJeans Fan Meeting [Get Up]",
      image: "https://picsum.photos/300/400?random=8",
      status: "available",
      location: "SK Olympic Handball Gymnasium",
    }
  ];

  const events = propEvents || defaultEvents;

  const handleEventClick = (event) => {
    console.log('Event clicked:', event);
    // 여기에 이벤트 클릭 핸들러 로직 추가
    // 예: 상세페이지 이동, 모달 열기 등
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