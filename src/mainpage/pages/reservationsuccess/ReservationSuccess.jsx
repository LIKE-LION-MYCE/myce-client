import React, { useState, useEffect } from "react";
import styles from "./ReservationSuccess.module.css";
import { Link, useParams } from "react-router-dom";
import { getReservationSuccess } from "../../../api/service/reservation/reservationApi";

export default function ReservationSuccess() {
  const { reservationId } = useParams();
  const [info, setInfo] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await getReservationSuccess(reservationId);
        if (alive) setInfo(data);
      } catch (e) {
        if (alive) setError(e?.response?.data?.message || e.message);
      }
    })();
    return () => {
      alive = false;
    };
  }, [reservationId]);

  const handleCopy = async () => {
    if (!info?.reservationCode) return;
    try {
      await navigator.clipboard.writeText(info.reservationCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("클립보드 복사에 실패했습니다.");
    }
  };

  if (error) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>예약 정보 조회 실패</h1>
        <p className={styles.subtitle}>{error}</p>
        <Link to="/" className={styles.homeButton}>
          메인 페이지
        </Link>
      </div>
    );
  }

  if (!info) {
    return <div className={styles.container}>로딩 중…</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>박람회 예약 완료!</h1>
      <p className={styles.subtitle}>티켓 정보가 이메일로 전송되었습니다</p>
      <p className={styles.email}>{info.email}</p>

      <button
        className={styles.resendButton}
        onClick={() => alert("이메일 재전송 API 연결 예정")}
      >
        이메일 재전송
      </button>

      <div className={styles.ticketBox}>
        <span className={styles.ticketLabel}>예매 번호</span>
        <div className={styles.ticketCodeBox}>
          <span className={styles.ticketCode}>{info.reservationCode}</span>
          <button className={styles.copyButton} onClick={handleCopy}>
            {copied ? "복사됨!" : "복사"}
          </button>
        </div>
      </div>

      <div className={styles.helpBox}>
        <p className={styles.helpText}>문제가 있으신가요?</p>
        <Link to="/contact" className={styles.contactLink}>
          <span className={styles.icon}>💬</span> 담당자 문의
        </Link>
      </div>

      <Link to="/" className={styles.homeButton}>
        메인 페이지
      </Link>
    </div>
  );
}
