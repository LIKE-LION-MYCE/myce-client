// src/pages/expo/ExpoDetail.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import styles from "./ExpoDetail.module.css";
import BoothModal from "../../components/modal/BoothModal";
import EmailVerifyModal from "../../components/modal/EmailVerifyModal";
import CancelFeeTable from "../../components/cancelfeetable/CancelFeeTable";
import { getTicketsForReservation } from "../../../api/service/user/TicketService";

const boothData = [
  {
    id: 1,
    name: "테크버스 랩",
    company: "링딩동",
    location: "A-4",
    description: "이 부스는 천안에서 시작해서... 영국을 건너...",
    imageUrl: "https://placehold.co/400x600",
  },
  {
    id: 2,
    name: "AI 부스",
    company: "AI 주식회사",
    location: "B-1",
    description: "AI 기술을 활용한 솔루션을 소개합니다...",
    imageUrl: "https://placehold.co/400x600",
  },
];

const reviewData = Array.from({ length: 25 }).map((_, index) => ({
  id: index + 1,
  name: `회원${index + 1}`,
  rating: (index % 5) + 1,
  content: `이것은 회원${index + 1}의 관람 후기입니다. 좋은 경험이었습니다!`,
  date: `2024.01.${25 - index}`,
}));

const tabs = ["상세 정보", "관람 후기", "장소 정보", "취소 수수료 안내"];

export default function ExpoDetail() {
  const [selectedBooth, setSelectedBooth] = useState(null);
  const [activeTab, setActiveTab] = useState("관람 후기");
  const [showEmailVerifyModal, setShowEmailVerifyModal] = useState(false); // New state for modal
  const navigate = useNavigate(); // Initialize useNavigate

  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;
  const { expoId } = useParams();

  // 티켓 관련 상태
  const [tickets, setTickets] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 티켓 조회 API 연동
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const list = await getTicketsForReservation(expoId); // GET /expos/:expoId/tickets/reservations
        setTickets(Array.isArray(list) ? list : []);
        setSelectedIndex(0);
        setQty(1);
        setError(null);
      } catch (e) {
        setError(e.message || "티켓을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    })();
  }, [expoId]);

  // 선택된 티켓/표시값 계산
  const ABSOLUTE_MAX_QTY = 4; // 최대 구매 수량 제한
  const isMember = useMemo(() => {
    const token = localStorage.getItem("access_token");
    return !!token; // 토큰 있는지에 따라 다름
  }, []);

  const selected = tickets[selectedIndex];
  const maxQty = useMemo(() => {
    let quantityLimit = selected?.remainingQuantity ?? 1;

    // 회원은 티켓 4개까지 가능
    quantityLimit = Math.min(quantityLimit, ABSOLUTE_MAX_QTY);

    // 비회원은 티켓 하나만 가능하도록
    if (!isMember) {
      quantityLimit = Math.min(quantityLimit, 1);
    }

    return quantityLimit;
  }, [selected, isMember]); // 회원 유형에 따라 티켓 다르게 보임

  const priceText = useMemo(() => {
    if (!selected) return "0원";
    return `${Number(selected.price ?? 0).toLocaleString("ko-KR")}원`;
  }, [selected]);

  const optionLabel = (t) =>
    `[${t.type}] ${t.name} (${t.remainingQuantity}장 남음)`;
  const ticketLabel = (t) => `[${t.type}] ${t.name}`;
  const dec = () => setQty((q) => Math.max(1, q - 1));
  const inc = () => setQty((q) => Math.min(maxQty, ABSOLUTE_MAX_QTY, q + 1));

  const handlePaymentClick = () => {
    
    if (isMember) {
      navigate(`/detail/${expoId}/payment`, {
        state: {
          ticketId: selected?.ticketId,
          quantity: qty,
          unitPrice: selected?.price,
          ticketName: ticketLabel(selected),
        },
      });
    } else {
      
      setShowEmailVerifyModal(true);
    }
  };

  const handleEmailVerifySuccess = () => {
    setShowEmailVerifyModal(false);
    // After successful email verification, proceed to payment page
    navigate(`/detail/${expoId}/payment`, {
      state: {
        ticketId: selected?.ticketId,
        quantity: qty,
        unitPrice: selected?.price,
        ticketName: ticketLabel(selected),
      },
    });
  };

  // 기존 리뷰 페이징 계산
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviewData.slice(
    indexOfFirstReview,
    indexOfLastReview
  );
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderTabContent = () => {
    switch (activeTab) {
      case "상세 정보":
        return (
          <section className={styles.detailSection}>
            <h3>행사 정보</h3>
            <p className={styles.description}>
              행사에 대한 상세 정보 영역입니다.
            </p>
            <h3>부스 정보</h3>
            <table className={styles.boothTable}>
              <thead>
                <tr>
                  <th>부스 이름</th>
                  <th>회사명</th>
                  <th>부스 위치</th>
                </tr>
              </thead>
              <tbody>
                {boothData.map((booth) => (
                  <tr key={booth.id} onClick={() => setSelectedBooth(booth)}>
                    <td>{booth.name}</td>
                    <td>{booth.company}</td>
                    <td>{booth.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        );
      case "관람 후기":
        return (
          <section className={styles.detailSection}>
            <h3>관람 후기</h3>
            {currentReviews.map((review) => (
              <div key={review.id} className={styles.reviewItem}>
                <strong>
                  {review.name} {"⭐️".repeat(review.rating)}
                </strong>
                <p>{review.content}</p>
                <span className={styles.reviewDate}>{review.date}</span>
              </div>
            ))}
            <Link to={`/detail/${expoId}/write-review`}>
              <button className={styles.writeReview}>후기 작성</button>
            </Link>
            <div className={styles.pagination}>
              {Array.from(
                { length: Math.ceil(reviewData.length / reviewsPerPage) },
                (_, i) => (
                  <button key={i} onClick={() => paginate(i + 1)}>
                    {i + 1}
                  </button>
                )
              )}
            </div>
          </section>
        );
      case "장소 정보":
        return (
          <section className={styles.detailSection}>
            <h3>행사 장소</h3>
            <p className={styles.description}>
              행사 세부 장소 텍스트입니다 ~~~길 ~~호 ~~동
            </p>
            <div className={styles.map}>지도 API</div>
          </section>
        );
      case "취소 수수료 안내":
        return (
          <section className={styles.detailSection}>
            <h3>취소 수수료 안내</h3>
            <CancelFeeTable />
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <section className={styles.headerSection}>
        <img
          src="https://cdn.getnews.co.kr/news/photo/202309/642737_352257_4815.jpg"
          alt="박람회 포스터"
          className={styles.poster}
        />
        <div className={styles.infoBox}>
          <h2 className={styles.title}>박람회 제목</h2>
          <p className={styles.location}>
            행사 위치 정보(API에서 받아올 수 있나요)
          </p>
          <p className={styles.date}>
            행사 기간 정보(????.??.?? ~ ?????.??.??)
          </p>
          <div className={styles.buttons}>
            <button className={styles.bookmark}>행사 찜하기</button>
            <button className={styles.chat}>1:1 채팅</button>
          </div>

          {/* 티켓 영역 */}
          <div className={styles.ticketBox}>
            {/* 로딩/에러/빈 상태 처리 */}
            {loading && <div>티켓 불러오는 중…</div>}
            {error && <div className={styles.error}>{error}</div>}

            {!loading && !error && (
              <>
                <label>
                  티켓 이름
                  <select
                    value={selectedIndex}
                    onChange={(e) => {
                      setSelectedIndex(Number(e.target.value));
                      setQty(1);
                    }}
                  >
                    {tickets.length === 0 && (
                      <option>판매 중인 티켓이 없습니다</option>
                    )}
                    {tickets.map((t, idx) => (
                      <option
                        key={t.ticketId}
                        value={idx}
                        disabled={t.remainingQuantity <= 0}
                      >
                        {t.remainingQuantity > 0
                          ? optionLabel(t)
                          : `[${t.type}] ${t.name} (매진)`}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  티켓 수
                  <div className={styles.counter}>
                    <button onClick={dec} disabled={!selected || qty <= 1}>
                      -
                    </button>
                    <span>{qty}</span>
                    <button onClick={inc} disabled={!selected || qty >= maxQty}>
                      +
                    </button>
                  </div>
                </label>

                <p className={styles.price}>판매 가격: {priceText}</p>

                {/* 결제 페이지로 선택값 전달 */}
                <button
                  className={styles.pay}
                  disabled={!selected || selected.remainingQuantity <= 0}
                  onClick={handlePaymentClick}
                >
                  티켓 결제
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      <nav className={styles.tabNav}>
        <ul>
          {tabs.map((tab) => (
            <li
              key={tab}
              className={activeTab === tab ? styles.active : ""}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </li>
          ))}
        </ul>
      </nav>

      {renderTabContent()}

      <BoothModal
        booth={selectedBooth}
        onClose={() => setSelectedBooth(null)}
      />

      {showEmailVerifyModal && (
        <EmailVerifyModal
          open={showEmailVerifyModal} // Pass the open prop
          onClose={() => setShowEmailVerifyModal(false)}
          onVerifySuccess={handleEmailVerifySuccess}
          onSendCode={async (email) => {
            console.log(`Mock: Sending code to ${email}`);
            return new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
          }}
          onVerify={async ({ email, code }) => {
            console.log(`Mock: Verifying code ${code} for ${email}`);
            return new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
          }}
        />
      )}
    </div>
  );
}
