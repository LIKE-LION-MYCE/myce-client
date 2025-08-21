import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
import ExpoHeader from '../../components/expoHeader/ExpoHeader';
import ExpoInfo from '../../components/expoInfo/ExpoInfo';
import ExpoTickets from '../../components/expoTickets/ExpoTickets';
import ExpoBooths from '../../components/expoBooths/ExpoBooths';
import ExpoEvents from '../../components/expoEvents/ExpoEvents';
import ExpoReviews from '../../components/expoReviews/ExpoReviews';
import TicketPurchaseModal from "../../components/ticketPurchaseModal/TicketPurchaseModal";

import LoadingSpinner from '../../../components/shared/LoadingSpinner';
import NonMemberPurchaseModal from "../../components/nonMemberPurchaseModal/nonMemberPurchaseModal";
import ChatModal from "../../../components/shared/chat/ChatModal";
import LoginPromptModal from "../../../components/shared/chat/LoginPromptModal";
import { isTokenExpired, decodeJWT } from "../../../api/utils/jwtUtils";
import { getOrCreateExpoChatRoom } from "../../../api/service/chat/chatService";

export default function ExpoDetail() {
  const { t } = useTranslation();
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
  const [userInfo, setUserInfo] = useState(null);
  const [activeTab, setActiveTab] = useState("info"); // info, tickets, booths, events, reviews, location
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showNonMemberModal, setShowNonMemberModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedTicketId, setSelectedTicketId] = useState("");

  // 채팅 관련 상태
  const [showChatModal, setShowChatModal] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    if (expoId) {
      loadExpoDetails();
    }

    // 사용자 정보 확인
    const token = localStorage.getItem('access_token');
    if (token && !isTokenExpired(token)) {
      try {
        const decoded = decodeJWT(token);
        setUserInfo({
          id: decoded.memberId,
          name: decoded.name
        });
      } catch (error) {
        console.error('토큰 디코딩 실패:', error);
      }
    }

    // URL 해시를 확인하여 해당 탭으로 이동
    const hash = window.location.hash;
    if (hash === '#reviews') {
      setActiveTab('reviews');
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
      const [
        ticketsData,
        bookmarkData,
        reviewsData,
        locationData,
        boothsData,
        eventsData,
      ] = await Promise.all([
        getExpoTickets(expoId).catch((err) => {
          console.error("티켓 정보 로드 실패:", err);
          return null;
        }),
        getExpoBookmarkStatus(expoId).catch((err) => {
          console.error("찜하기 상태 로드 실패:", err);
          // 로그인하지 않은 경우 기본값 반환
          return { isBookmarked: false };
        }),
        getExpoReviews(expoId).catch((err) => {
          console.error("리뷰 정보 로드 실패:", err);
          return null;
        }),
        getExpoLocation(expoId).catch((err) => {
          console.error("위치 정보 로드 실패:", err);
          return null;
        }),
        getExpoBooths(expoId).catch((err) => {
          console.error("부스 정보 로드 실패:", err);
          return null;
        }),
        getExpoEvents(expoId).catch((err) => {
          console.error("이벤트 정보 로드 실패:", err);
          return null;
        }),
      ]);

      setTickets(ticketsData);
      setBookmarkStatus(bookmarkData);
      setReviews(reviewsData);
      setLocation(locationData);
      setBooths(boothsData);
      setEvents(eventsData);
    } catch (err) {
      console.error("박람회 상세 정보 로드 실패:", err);
      setError("박람회 정보를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleBookmarkToggle = async () => {
    // 로그인 확인
    const token = localStorage.getItem('access_token');
    if (!token || isTokenExpired(token)) {
      alert('로그인이 필요한 서비스입니다.');
      return;
    }

    try {
      const result = await toggleExpoBookmark(expoId);

      // 상태 즉시 업데이트
      setBookmarkStatus(prev => ({
        ...prev,
        isBookmarked: result.isBookmarked
      }));

      // 성공 메시지
      if (result.isBookmarked) {
        alert(t('expoDetail.expoDetailMain.alerts.bookmarkAdded', '북마크에 추가되었습니다.'));
      } else {
        alert(t('expoDetail.expoDetailMain.alerts.bookmarkRemoved', '북마크에서 제거되었습니다.'));
      }

    } catch (err) {
      console.error("찜하기 토글 실패:", err);

      if (err.response?.status === 401) {
        alert(t('expoDetail.expoDetailMain.alerts.loginRequired', '로그인이 필요한 서비스입니다.'));
        localStorage.removeItem('access_token');
      } else {
        alert(t('expoDetail.expoDetailMain.alerts.bookmarkError', '찜하기 처리에 실패했습니다.'));
      }
    }
  };

  // 채팅 시작 핸들러
  const handleChatStart = async () => {
    const token = localStorage.getItem('access_token');

    // 로그인 체크
    if (!token || isTokenExpired(token)) {
      setShowLoginPrompt(true);
      return;
    }

    try {
      setLoading(true);
      console.log('🟡 박람회 채팅방 생성 요청 - expoId:', expoId);

      // 채팅방 생성 또는 조회
      const response = await getOrCreateExpoChatRoom(expoId);
      console.log('✅ 채팅방 생성/조회 성공:', response.data);

      // 채팅 모달 열기
      setShowChatModal(true);

    } catch (error) {
      console.error('❌ 채팅방 생성 실패:', error);

      if (error.response?.status === 401) {
        // 토큰이 유효하지 않은 경우
        localStorage.removeItem('access_token');
        setShowLoginPrompt(true);
      } else if (error.response?.status === 404) {
        alert('박람회 정보를 찾을 수 없습니다.');
      } else {
        alert('채팅을 시작할 수 없습니다. 잠시 후 다시 시도해주세요.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 채팅 모달 닫기
  const handleChatClose = () => {
    setShowChatModal(false);
  };

  // 로그인 프롬프트 닫기
  const handleLoginPromptClose = () => {
    setShowLoginPrompt(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("ko-KR");
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    return timeString.substring(0, 5); // HH:mm 형식으로 변환
  };

  const handleTicketPurchase = (ticket) => {
    setSelectedTicket(ticket);
    const token = localStorage.getItem("access_token");
    if (token && !isTokenExpired(token)) {
      setShowPurchaseModal(true);
    } else {
      setShowNonMemberModal(true);
    }
  };

  const handleDropdownPurchase = () => {
    console.log('ticket!!!!!' + selectedTicketId);
    if (!selectedTicketId) {
      alert("티켓을 선택해주세요.");
      return;
    }

    const ticket = tickets.find(
      (t) => t.ticketId === selectedTicketId
    );

    console.log(ticket)
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
  }

  const handleCloseNonMemberModal = () => {
    setShowNonMemberModal(false);
    setSelectedTicket(null);
  };

  if (loading) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.container}>

          <LoadingSpinner />
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
          <div className={styles.error}>{t('expoDetail.expoDetailMain.errors.expoNotFound', '박람회 정보를 찾을 수 없습니다.')}</div>
        </div>
      </div>
    );
  }

  const formatDisplayDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isPendingPublish = basicInfo?.status === 'PENDING_PUBLISH';

  return (
    <div className={styles.pageWrapper}>
      <div className={`${styles.container} ${isPendingPublish ? styles.pendingPublish : ''}`}>
        {/* 뒤로가기 버튼 */}
        <div className={styles.backButtonSection}>
          <button className={styles.backButton} onClick={handleGoBack}>
            <FiArrowLeft size={20} />
            <span>{t('expoDetail.expoDetailMain.navigation.back', '이전으로')}</span>
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
          onChatStart={handleChatStart}
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
            {t('expoDetail.expoDetailMain.tabs.info', '상세 정보')}
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'tickets' ? styles.active : ''}`}
            onClick={() => setActiveTab('tickets')}
          >
            {t('expoDetail.expoDetailMain.tabs.tickets', '티켓 정보')}
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'booths' ? styles.active : ''}`}
            onClick={() => setActiveTab('booths')}
          >
            {t('expoDetail.expoDetailMain.tabs.booths', '부스 정보')} ({booths?.length || 0})
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'events' ? styles.active : ''}`}
            onClick={() => setActiveTab('events')}
          >
            {t('expoDetail.expoDetailMain.tabs.events', '이벤트')} ({events?.length || 0})
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'reviews' ? styles.active : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            {t('expoDetail.expoDetailMain.tabs.reviews', '리뷰')} ({reviews?.totalElements || 0})
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
            <ExpoReviews expoId={expoId} userInfo={userInfo} />
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

        {/* 비회원 구매 모달 */}
        <NonMemberPurchaseModal
          ticket={selectedTicket}
          expoId={expoId}
          isOpen={showNonMemberModal}
          onClose={handleCloseNonMemberModal}
        />

        {/* 채팅 모달 */}
        <ChatModal
          isOpen={showChatModal}
          onClose={handleChatClose}
        />

        {/* 로그인 프롬프트 모달 */}
        <LoginPromptModal
          isOpen={showLoginPrompt}
          onClose={handleLoginPromptClose}
        />
      </div>

      {/* PENDING_PUBLISH 상태 오버레이 - container 밖으로 이동 */}
      {isPendingPublish && (
        <div className={styles.pendingOverlay}>
          <div className={styles.pendingMessage}>
            <h2 className={styles.pendingTitle}>COMING SOON</h2>
            <p className={styles.pendingText}>
              {basicInfo.displayStartDate
                ? `${formatDisplayDate(basicInfo.displayStartDate)}에 찾아옵니다.`
                : '곧 공개될 예정입니다.'
              }
            </p>
            <div className={styles.pendingSubtext}>
              현재 준비 중인 박람회입니다
            </div>
            <button
              className={styles.homeButton}
              onClick={() => navigate('/')}
            >
              홈으로
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
