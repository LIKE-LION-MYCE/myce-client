import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MyReservationPage.module.css";
import { getReservedExpos } from "../../../api/service/user/memberApi";

function ReservationCard({ reservation }) {
  const navigate = useNavigate();

  return (
    <div className={styles.card}>
      <div className={styles.info}>
        <h3>{reservation.title}</h3>
        <p>예매번호: {reservation.reservationCode}</p>
        <div className={styles.detailRow}>
          <div>
            <strong>티켓 이름</strong>
            <p>{reservation.ticketName}</p>
          </div>
          <div>
            <strong>티켓수</strong>
            <p>{reservation.ticketCount}매</p>
          </div>
          <div>
            <strong>티켓가격</strong>
            <p>{reservation.ticketPrice?.toLocaleString()}원</p>
          </div>
        </div>
        <div className={styles.buttons}>
          <button
            className={styles.primaryBtn}
            onClick={() => navigate(`./${reservation.reservationId}`)}
          >
            예매 상세
          </button>
          <button className={styles.secondaryBtn}>예매 취소</button>
        </div>
      </div>
      <img
        src={reservation.thumbnailUrl || '/default-expo-image.jpg'}
        alt={reservation.title + " 포스터"}
        className={styles.poster}
      />
    </div>
  );
}

const MyReservationPage = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReservedExpos();
  }, []);

  const fetchReservedExpos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getReservedExpos();
      setReservations(response.data || []);
    } catch (err) {
      console.error('예매 내역 조회 실패:', err);
      setError('예매 내역을 불러오는데 실패했습니다.');
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <h2 className={styles.pageTitle}>예매 내역</h2>
        <div className={styles.loading}>로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.wrapper}>
        <h2 className={styles.pageTitle}>예매 내역</h2>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.pageTitle}>예매 내역</h2>
      {reservations.length > 0 ? (
        <div className={styles.list}>
          {reservations.map((reservation) => (
            <ReservationCard key={reservation.reservationId} reservation={reservation} />
          ))}
        </div>
      ) : (
        <div className={styles.noData}>예매 내역이 없습니다.</div>
      )}
    </div>
  );
};

export default MyReservationPage;
