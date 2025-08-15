import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import styles from './ExpoDetail.module.css';
import { 
  getExpoBasicInfo, 
  getExpoTickets, 
  getExpoBookmarkStatus, 
  getExpoReviews, 
  getExpoLocation,
  getExpoBooths,
  getExpoEvents,
  toggleExpoBookmark
} from '../../../api/service/expo/expoDetailApi';
import TicketPurchaseModal from '../../components/ticketPurchaseModal/TicketPurchaseModal';
import ExpoHeader from '../../components/expoHeader/ExpoHeader';
import ExpoInfo from '../../components/expoInfo/ExpoInfo';
import ExpoTickets from '../../components/expoTickets/ExpoTickets';
import ExpoBooths from '../../components/expoBooths/ExpoBooths';
import ExpoEvents from '../../components/expoEvents/ExpoEvents';
import ExpoReviews from '../../components/expoReviews/ExpoReviews';

export default function ExpoDetail() {
  const { expoId } = useParams();
  const navigate = useNavigate();
  const [basicInfo, setBasicInfo] = useState(null);
  const [tickets, setTickets] = useState(null);
  const [bookmarkStatus, setBookmarkStatus] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [location, setLocation] = useState(null);
  const [booths, setBooths] = useState(null);
  const [businessProfile, setBusinessProfile] = useState(null);
  const [events, setEvents] = useState(null);
  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedTicketId, setSelectedTicketId] = useState('');

  useEffect(() => {
    if (expoId) {
      loadExpoDetails();
    }
  }, [expoId]);

  const loadExpoDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 기본 정보는 항상 로드
      const basicData = await getExpoBasicInfo(expoId);
      setBasicInfo(basicData);
      
      // 다른 정보들도 병렬로 로드
      const [ticketsData, bookmarkData, reviewsData, locationData, boothsData, eventsData] = await Promise.all([
        getExpoTickets(expoId).catch(err => {
          console.error('티켓 정보 로드 실패:', err);
          return null;
        }),
        getExpoBookmarkStatus(expoId).catch(err => {
          console.error('찜하기 상태 로드 실패:', err);
          return null;
        }),
        getExpoReviews(expoId).catch(err => {
          console.error('리뷰 정보 로드 실패:', err);
          return null;
        }),
        getExpoLocation(expoId).catch(err => {
          console.error('위치 정보 로드 실패:', err);
          return null;
        }),
        getExpoBooths(expoId).catch(err => {
          console.error('부스 정보 로드 실패:', err);
          return null;
        }),
        getExpoEvents(expoId).catch(err => {
          console.error('이벤트 정보 로드 실패:', err);
          return null;
        })
      ]);
      
      setTickets(ticketsData);
      setBookmarkStatus(bookmarkData);
      setReviews(reviewsData);
      setLocation(locationData);
      setBooths(boothsData);
      setEvents(eventsData);
      
    } catch (err) {
      console.error('박람회 상세 정보 로드 실패:', err);
      setError('박람회 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleBookmarkToggle = async () => {
    try {
      await toggleExpoBookmark(expoId);
      // 찜하기 상태 다시 로드
      const updatedBookmarkStatus = await getExpoBookmarkStatus(expoId);
      setBookmarkStatus(updatedBookmarkStatus);
    } catch (err) {
      console.error('찜하기 토글 실패:', err);
      alert('찜하기 처리에 실패했습니다.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString.substring(0, 5); // HH:mm 형식으로 변환
  };

  const handleTicketPurchase = (ticket) => {
    setSelectedTicket(ticket);
    setShowPurchaseModal(true);
  };

  const handleDropdownPurchase = () => {
    if (!selectedTicketId) {
      alert('티켓을 선택해주세요.');
      return;
    }
    
    const ticket = tickets.find(t => t.ticketId.toString() === selectedTicketId);
    if (ticket) {
      handleTicketPurchase(ticket);
    }
  };

  const handleClosePurchaseModal = () => {
    setShowPurchaseModal(false);
    setSelectedTicket(null);
  };

  const handleGoBack = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  if (loading) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.container}>
          <div className={styles.loading}>로딩 중...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.container}>
          <div className={styles.error}>{error}</div>
        </div>
      </div>
    );
  }

  if (!basicInfo) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.container}>
          <div className={styles.error}>박람회 정보를 찾을 수 없습니다.</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        {/* 뒤로가기 버튼 */}
        <div className={styles.backButtonSection}>
          <button className={styles.backButton} onClick={handleGoBack}>
            <FiArrowLeft size={20} />
            <span>이전으로</span>
          </button>
        </div>

        {/* 헤더 섹션 */}
        <ExpoHeader
          basicInfo={basicInfo}
          bookmarkStatus={bookmarkStatus}
          tickets={tickets}
          selectedTicketId={selectedTicketId}
          onTicketSelect={setSelectedTicketId}
          onPurchase={handleDropdownPurchase}
          onBookmarkToggle={handleBookmarkToggle}
          formatDate={formatDate}
          formatTime={formatTime}
          loading={loading}
        />

        {/* 탭 메뉴 */}
        <div className={styles.tabs}>
          <button 
            className={`${styles.tab} ${activeTab === 'info' ? styles.active : ''}`}
            onClick={() => setActiveTab('info')}
          >
            상세 정보
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'tickets' ? styles.active : ''}`}
            onClick={() => setActiveTab('tickets')}
          >
            티켓 정보
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'booths' ? styles.active : ''}`}
            onClick={() => setActiveTab('booths')}
          >
            부스 정보 ({booths?.length || 0})
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'events' ? styles.active : ''}`}
            onClick={() => setActiveTab('events')}
          >
            이벤트 ({events?.length || 0})
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'reviews' ? styles.active : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            리뷰 ({reviews?.totalReviews || 0})
          </button>
        </div>

        {/* 탭 컨텐츠 */}
        <div className={styles.tabContent}>
          {activeTab === 'info' && (
            <ExpoInfo 
              basicInfo={basicInfo} 
              location={location} 
            />
          )}
          
          {activeTab === 'tickets' && (
            <ExpoTickets tickets={tickets} />
          )}
          
          {activeTab === 'booths' && (
            <ExpoBooths booths={booths} />
          )}
          
          {activeTab === 'events' && (
            <ExpoEvents 
              events={events}
              formatDate={formatDate}
              formatTime={formatTime}
            />
          )}
          
          {activeTab === 'reviews' && (
            <ExpoReviews reviews={reviews} />
          )}
        </div>

        {/* 티켓 구매 모달 */}
        <TicketPurchaseModal
          ticket={selectedTicket}
          expoId={expoId}
          expoTitle={basicInfo?.title}
          isOpen={showPurchaseModal}
          onClose={handleClosePurchaseModal}
        />
      </div>
    </div>
  );
}