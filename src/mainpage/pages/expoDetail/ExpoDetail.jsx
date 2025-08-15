import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./ExpoDetail.module.css";
import {
  getExpoBasicInfo,
  getExpoTickets,
  getExpoBookmarkStatus,
  getExpoReviews,
  getExpoLocation,
  getExpoBooths,
  getExpoBusinessProfile,
  getExpoEvents,
  toggleExpoBookmark,
} from "../../../api/service/expo/expoDetailApi";
import {
  FiBookmark,
  FiBookmark as FiBookmarkFill,
  FiMapPin,
  FiClock,
  FiUsers,
  FiCalendar,
} from "react-icons/fi";
import TicketPurchaseModal from "../../components/ticketPurchaseModal/TicketPurchaseModal";
import NonMemberPurchaseModal from "../../../mainpage/components/nonMemberPurchaseModal/nonMemberPurchaseModal";
import { isTokenExpired } from "../../../api/utils/jwtUtils";

export default function ExpoDetail() {
  const { expoId } = useParams();
  const [basicInfo, setBasicInfo] = useState(null);
  const [tickets, setTickets] = useState(null);
  const [bookmarkStatus, setBookmarkStatus] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [location, setLocation] = useState(null);
  const [booths, setBooths] = useState(null);
  const [businessProfile, setBusinessProfile] = useState(null);
  const [events, setEvents] = useState(null);
  const [activeTab, setActiveTab] = useState("info"); // info, tickets, booths, events, reviews, location
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showNonMemberModal, setShowNonMemberModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedTicketId, setSelectedTicketId] = useState("");

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
          return null;
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
    try {
      await toggleExpoBookmark(expoId);
      // 찜하기 상태 다시 로드
      const updatedBookmarkStatus = await getExpoBookmarkStatus(expoId);
      setBookmarkStatus(updatedBookmarkStatus);
    } catch (err) {
      console.error("찜하기 토글 실패:", err);
      alert("찜하기 처리에 실패했습니다.");
    }
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
    if (!selectedTicketId) {
      alert("티켓을 선택해주세요.");
      return;
    }

    const ticket = tickets.find(
      (t) => t.ticketId.toString() === selectedTicketId
    );
    if (ticket) {
      handleTicketPurchase(ticket);
    }
  };

  const handleClosePurchaseModal = () => {
    setShowPurchaseModal(false);
    setSelectedTicket(null);
  };

  const handleCloseNonMemberModal = () => {
    setShowNonMemberModal(false);
    setSelectedTicket(null);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  if (!basicInfo) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>박람회 정보를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* 헤더 섹션 */}
      <div className={styles.header}>
        <div className={styles.imageSection}>
          <img
            src={basicInfo.thumbnailUrl}
            alt={basicInfo.title}
            className={styles.thumbnail}
            onError={(e) => {
              e.target.src =
                "https://flexible.img.hani.co.kr/flexible/normal/590/590/imgdb/resize/2007/1227/68227042_20071227.jpg";
            }}
          />
        </div>

        <div className={styles.infoSection}>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>{basicInfo.title}</h1>
            {bookmarkStatus && (
              <button
                className={styles.bookmarkBtn}
                onClick={handleBookmarkToggle}
              >
                {bookmarkStatus.isBookmarked ? (
                  <FiBookmarkFill size={24} fill="red" />
                ) : (
                  <FiBookmark size={24} />
                )}
                <span>{bookmarkStatus.bookmarkCount}</span>
              </button>
            )}
          </div>

          <div className={styles.basicDetails}>
            <div className={styles.detailItem}>
              <FiCalendar className={styles.icon} />
              <span>
                {formatDate(basicInfo.startDate)} ~{" "}
                {formatDate(basicInfo.endDate)}
              </span>
            </div>
            <div className={styles.detailItem}>
              <FiClock className={styles.icon} />
              <span>
                {formatTime(basicInfo.startTime)} ~{" "}
                {formatTime(basicInfo.endTime)}
              </span>
            </div>

            <div className={styles.detailItem}>
              <FiMapPin className={styles.icon} />
              <span>{basicInfo.location}</span>
              {basicInfo.locationDetail && (
                <span className={styles.detail}>
                  ({basicInfo.locationDetail})
                </span>
              )}
            </div>

            <div className={styles.detailItem}>
              <FiUsers className={styles.icon} />
              <span>
                현재 {basicInfo.currentReservationCount?.toLocaleString()}명
                예약
              </span>
            </div>
          </div>

          <div className={styles.categories}>
            {basicInfo.categories?.map((category, index) => (
              <span key={index} className={styles.category}>
                {category}
              </span>
            ))}
          </div>

          {/* 티켓 구매 섹션 */}
          <div className={styles.ticketPurchaseSection}>
            <h3>티켓 구매</h3>
            <div className={styles.ticketDropdownContainer}>
              <select
                className={styles.ticketSelect}
                value={selectedTicketId}
                onChange={(e) => setSelectedTicketId(e.target.value)}
              >
                <option value="">티켓을 선택하세요</option>
                {tickets && tickets.length > 0 ? (
                  tickets.map((ticket) => (
                    <option
                      key={ticket.ticketId}
                      value={ticket.ticketId}
                      disabled={ticket.remainingQuantity <= 0}
                    >
                      [{ticket.type}] {ticket.name} -{" "}
                      {ticket.price?.toLocaleString()}원 (남은 수량:{" "}
                      {ticket.remainingQuantity?.toLocaleString()})
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    등록된 티켓이 없습니다
                  </option>
                )}
              </select>
              <button
                className={`${styles.purchaseBtn} ${
                  !selectedTicketId || !tickets || tickets.length === 0
                    ? styles.disabled
                    : ""
                }`}
                disabled={!selectedTicketId || !tickets || tickets.length === 0}
                onClick={handleDropdownPurchase}
              >
                구매하기
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 탭 메뉴 */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${
            activeTab === "info" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("info")}
        >
          상세 정보
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "tickets" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("tickets")}
        >
          티켓 정보
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "booths" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("booths")}
        >
          부스 정보 ({booths?.length || 0})
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "events" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("events")}
        >
          이벤트 ({events?.length || 0})
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "reviews" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("reviews")}
        >
          리뷰 ({reviews?.totalReviews || 0})
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "location" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("location")}
        >
          위치 정보
        </button>
      </div>

      {/* 탭 컨텐츠 */}
      <div className={styles.tabContent}>
        {activeTab === "info" && (
          <div className={styles.infoTab}>
            <div className={styles.description}>
              <h3>상세 설명</h3>
              <p>{basicInfo.description || "상세 설명이 없습니다."}</p>
            </div>

            {/* 주최자 정보 섹션 - 기본 정보에서 추출 */}
            {basicInfo && (
              <div className={styles.businessProfile}>
                <h3>주최자 정보</h3>
                <div className={styles.businessCard}>
                  <div className={styles.businessHeader}>
                    <h4>{basicInfo.organizerName || "주최자 정보 없음"}</h4>
                  </div>
                  <div className={styles.businessDetails}>
                    {basicInfo.organizerContact && (
                      <p className={styles.businessPhone}>
                        📞 연락처: {basicInfo.organizerContact}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "tickets" && (
          <div className={styles.ticketsSection}>
            <h3>티켓 정보</h3>
            {tickets && tickets.length > 0 ? (
              <div className={styles.ticketsList}>
                {tickets.map((ticket) => (
                  <div key={ticket.ticketId} className={styles.ticketInfoCard}>
                    <div className={styles.ticketDetails}>
                      <h4>{ticket.name}</h4>
                      <p className={styles.ticketType}>
                        {ticket.type === "EARLY_BIRD" ? "얼리버드" : "일반"}
                      </p>
                      <p className={styles.price}>
                        {ticket.price?.toLocaleString()}원
                      </p>
                      <p className={styles.quantity}>
                        남은 수량: {ticket.remainingQuantity?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>등록된 티켓이 없습니다.</p>
            )}
          </div>
        )}

        {activeTab === "booths" && (
          <div className={styles.boothsSection}>
            <h3>부스 정보</h3>
            {booths && booths.length > 0 ? (
              <div className={styles.boothsList}>
                {booths.map((booth) => (
                  <div key={booth.id} className={styles.boothCard}>
                    <div className={styles.boothHeader}>
                      <h4>{booth.name}</h4>
                      <span className={styles.boothNumber}>
                        부스 #{booth.boothNumber}
                      </span>
                      {booth.isPremium && (
                        <span className={styles.premiumBadge}>프리미엄</span>
                      )}
                    </div>
                    <div className={styles.boothContent}>
                      {booth.mainImageUrl && (
                        <img
                          src={booth.mainImageUrl}
                          alt={booth.name}
                          className={styles.boothImage}
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      )}
                      <p className={styles.boothDescription}>
                        {booth.description || "부스 설명이 없습니다."}
                      </p>
                      <div className={styles.contactInfo}>
                        {booth.contactName && (
                          <p className={styles.contactName}>
                            👤 담당자: {booth.contactName}
                          </p>
                        )}
                        {booth.contactPhone && (
                          <p className={styles.contactPhone}>
                            📞 연락처: {booth.contactPhone}
                          </p>
                        )}
                        {booth.contactEmail && (
                          <p className={styles.contactEmail}>
                            📧 이메일: {booth.contactEmail}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>등록된 부스가 없습니다.</p>
            )}
          </div>
        )}

        {activeTab === "events" && (
          <div className={styles.eventsSection}>
            <h3>이벤트 정보</h3>
            {events && events.length > 0 ? (
              <div className={styles.eventsList}>
                {events.map((event) => (
                  <div key={event.id} className={styles.eventCard}>
                    <div className={styles.eventHeader}>
                      <h4>{event.name}</h4>
                      {event.location && (
                        <div className={styles.eventLocationHeader}>
                          📍 {event.location}
                        </div>
                      )}
                    </div>
                    <div className={styles.eventDateTime}>
                      <div className={styles.eventDate}>
                        📅 {formatDate(event.eventDate)}
                      </div>
                      <div className={styles.eventTime}>
                        🕐 {formatTime(event.startTime)} -{" "}
                        {formatTime(event.endTime)}
                      </div>
                    </div>
                    <div className={styles.eventContent}>
                      <p className={styles.eventDescription}>
                        {event.description || "이벤트 설명이 없습니다."}
                      </p>

                      <div className={styles.contactInfo}>
                        {event.contactName && (
                          <p className={styles.contactName}>
                            👤 담당자: {event.contactName}
                          </p>
                        )}
                        {event.contactPhone && (
                          <p className={styles.contactPhone}>
                            📞 연락처: {event.contactPhone}
                          </p>
                        )}
                        {event.contactEmail && (
                          <p className={styles.contactEmail}>
                            📧 이메일: {event.contactEmail}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>등록된 이벤트가 없습니다.</p>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className={styles.reviewsSection}>
            <h3>리뷰</h3>
            {reviews?.averageRating > 0 ? (
              <div className={styles.reviewStats}>
                <p>평균 평점: ⭐ {reviews.averageRating.toFixed(1)}</p>
                <p>총 리뷰 수: {reviews.totalReviews}개</p>

                {/* 별점별 분포 */}
                {reviews.ratingSummary && (
                  <div className={styles.ratingSummary}>
                    <div className={styles.ratingBar}>
                      <span>5점</span>
                      <div className={styles.barContainer}>
                        <div
                          className={styles.bar}
                          style={{
                            width: `${
                              (reviews.ratingSummary.fiveStars /
                                reviews.totalReviews) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                      <span>{reviews.ratingSummary.fiveStars}</span>
                    </div>
                    <div className={styles.ratingBar}>
                      <span>4점</span>
                      <div className={styles.barContainer}>
                        <div
                          className={styles.bar}
                          style={{
                            width: `${
                              (reviews.ratingSummary.fourStars /
                                reviews.totalReviews) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                      <span>{reviews.ratingSummary.fourStars}</span>
                    </div>
                    <div className={styles.ratingBar}>
                      <span>3점</span>
                      <div className={styles.barContainer}>
                        <div
                          className={styles.bar}
                          style={{
                            width: `${
                              (reviews.ratingSummary.threeStars /
                                reviews.totalReviews) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                      <span>{reviews.ratingSummary.threeStars}</span>
                    </div>
                    <div className={styles.ratingBar}>
                      <span>2점</span>
                      <div className={styles.barContainer}>
                        <div
                          className={styles.bar}
                          style={{
                            width: `${
                              (reviews.ratingSummary.twoStars /
                                reviews.totalReviews) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                      <span>{reviews.ratingSummary.twoStars}</span>
                    </div>
                    <div className={styles.ratingBar}>
                      <span>1점</span>
                      <div className={styles.barContainer}>
                        <div
                          className={styles.bar}
                          style={{
                            width: `${
                              (reviews.ratingSummary.oneStars /
                                reviews.totalReviews) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                      <span>{reviews.ratingSummary.oneStars}</span>
                    </div>
                  </div>
                )}

                {/* 리뷰 목록 */}
                {reviews.reviews && reviews.reviews.length > 0 && (
                  <div className={styles.reviewsList}>
                    {reviews.reviews.map((review) => (
                      <div key={review.reviewId} className={styles.reviewCard}>
                        <div className={styles.reviewHeader}>
                          <div className={styles.reviewerInfo}>
                            <span className={styles.reviewerName}>
                              {review.memberName}
                            </span>
                            {review.isMyReview && (
                              <span className={styles.myReviewBadge}>
                                내 리뷰
                              </span>
                            )}
                          </div>
                          <div className={styles.reviewRating}>
                            {"⭐".repeat(review.rating)}
                          </div>
                          <span className={styles.reviewDate}>
                            {new Date(review.createdAt).toLocaleDateString(
                              "ko-KR"
                            )}
                          </span>
                        </div>
                        <div className={styles.reviewContent}>
                          <h4 className={styles.reviewTitle}>{review.title}</h4>
                          <p className={styles.reviewComment}>
                            {review.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p>아직 리뷰가 없습니다.</p>
            )}
          </div>
        )}

        {activeTab === "location" && (
          <div className={styles.locationSection}>
            <h3>위치 정보</h3>
            {location ? (
              <div className={styles.locationInfo}>
                <p>
                  <strong>주소:</strong> {location.location}
                </p>
                {location.locationDetail && (
                  <p>
                    <strong>상세 주소:</strong> {location.locationDetail}
                  </p>
                )}
                {location.latitude && location.longitude && (
                  <div className={styles.coordinates}>
                    <p>
                      위도: {location.latitude}, 경도: {location.longitude}
                    </p>
                    {/* TODO: 지도 컴포넌트 추가 */}
                  </div>
                )}
              </div>
            ) : (
              <p>위치 정보를 불러올 수 없습니다.</p>
            )}
          </div>
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
    </div>
  );
}
