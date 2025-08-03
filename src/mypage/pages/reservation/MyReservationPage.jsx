import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MyReservationPage.module.css";

const reservations = [
  {
    id: "B0014561892370",
    expoName: "2024 서울 모터쇼",
    date: "2024-02-15",
    ticketCount: 2,
    visitTime: "10:00",
    posterUrl:
      "https://mblogthumb-phinf.pstatic.net/MjAyNDAzMjFfMTU5/MDAxNzExMDA1ODI4MTQw.psQX0d6NIIndrBZEQG5hYpU7lEzdUL7MKTi26EN0VdAg.nCl1urMS90FJqqYkUYhTn1udIBHVy5gSi6dfgvne2vUg.JPEG/NMF2024_4.jpg?type=w800",
  },
  {
    id: "B00145613451370",
    expoName: "디지털 헬스케어 박람회",
    date: "2024-02-15",
    ticketCount: 2,
    visitTime: "10:00",
    posterUrl:
      "https://mblogthumb-phinf.pstatic.net/MjAyNDAzMjFfMTU5/MDAxNzExMDA1ODI4MTQw.psQX0d6NIIndrBZEQG5hYpU7lEzdUL7MKTi26EN0VdAg.nCl1urMS90FJqqYkUYhTn1udIBHVy5gSi6dfgvne2vUg.JPEG/NMF2024_4.jpg?type=w800",
  },
  {
    id: "B00145613451371",
    expoName: "디지털 헬스케어 박람회",
    date: "2024-02-15",
    ticketCount: 2,
    visitTime: "10:00",
    posterUrl:
      "https://mblogthumb-phinf.pstatic.net/MjAyNDAzMjFfMTU5/MDAxNzExMDA1ODI4MTQw.psQX0d6NIIndrBZEQG5hYpU7lEzdUL7MKTi26EN0VdAg.nCl1urMS90FJqqYkUYhTn1udIBHVy5gSi6dfgvne2vUg.JPEG/NMF2024_4.jpg?type=w800",
  },
  {
    id: "B00145613451371",
    expoName: "디지털 헬스케어 박람회",
    date: "2024-02-15",
    ticketCount: 2,
    visitTime: "10:00",
    posterUrl:
      "https://mblogthumb-phinf.pstatic.net/MjAyNDAzMjFfMTU5/MDAxNzExMDA1ODI4MTQw.psQX0d6NIIndrBZEQG5hYpU7lEzdUL7MKTi26EN0VdAg.nCl1urMS90FJqqYkUYhTn1udIBHVy5gSi6dfgvne2vUg.JPEG/NMF2024_4.jpg?type=w800",
  },
];

function ReservationCard({ reservation }) {
  const navigate = useNavigate();

  return (
    <div className={styles.card}>
      <div className={styles.info}>
        <h3>{reservation.expoName}</h3>
        <p>예매번호: {reservation.id}</p>
        <p>관람일: {reservation.date}</p>
        <div className={styles.detailRow}>
          <div>
            <strong>티켓수</strong>
            <p>{reservation.ticketCount}매</p>
          </div>
          <div>
            <strong>관람시간</strong>
            <p>{reservation.visitTime}</p>
          </div>
        </div>
        <div className={styles.buttons}>
          <button
            className={styles.primaryBtn}
            onClick={() => navigate(`./${reservation.id}`)}
          >
            예매 상세
          </button>
          <button className={styles.secondaryBtn}>예매 취소</button>
        </div>
      </div>
      <img
        src={reservation.posterUrl}
        alt={reservation.expoName + " 포스터"}
        className={styles.poster}
      />
    </div>
  );
}

const MyReservationPage = () => {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.pageTitle}>예매 내역</h2>
      <div className={styles.list}>
        {reservations.map((reservation) => (
          <ReservationCard key={reservation.id} reservation={reservation} />
        ))}
      </div>
    </div>
  );
};

export default MyReservationPage;
