import React, { useState, useEffect } from "react";
import styles from "./ReservationPending.module.css"; // CSS 파일 경로 수정
import { Link, useParams } from "react-router-dom";
import { getReservationPending } from "../../../api/service/reservation/reservationApi";

export default function ReservationPending() {
  const { reservationId } = useParams();
  // state 변수 이름을 더 명확하게 accountInfo로 변경했습니다.
  const [accountInfo, setAccountInfo] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        // 가상계좌 정보를 가져오는 API를 호출합니다.
        const data = await getReservationPending(reservationId);
        setAccountInfo(data);
      } catch (e) {
        setError(
          e?.response?.data?.message || "예약 정보를 불러오는 데 실패했습니다."
        );
      }
    })();
  }, [reservationId]);

  // 어떤 텍스트든 복사할 수 있도록 handleCopy 함수를 수정했습니다.
  const handleCopy = async (textToCopy, type) => {
    if (!textToCopy) return;
    try {
      await navigator.clipboard.writeText(textToCopy);
      alert(`${type}가 복사되었습니다.`);
    } catch {
      alert("클립보드 복사에 실패했습니다.");
    }
  };

  if (error) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>정보 조회 실패</h1>
        <p className={styles.subtitle}>{error}</p>
        <Link to="/" className={styles.homeButton}>
          메인 페이지
        </Link>
      </div>
    );
  }

  if (!accountInfo) {
    return <div className={styles.container}>로딩 중…</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>가상계좌가 발급되었습니다</h1>
      <p className={styles.subtitle}>
        예약을 완료하려면 아래 계좌 정보로 입금해주세요.
      </p>

      {/* 가상계좌 정보를 보여주는 UI로 변경했습니다. */}
      <div className={styles.infoBox}>
        <div className={styles.infoRow}>
          <span>은행</span>
          <strong>{accountInfo.accountBank}</strong>
        </div>
        <div className={styles.infoRow}>
          <span>계좌번호</span>
          <div className={styles.copyable}>
            <strong>{accountInfo.accountNumber}</strong>
            <button
              className={styles.copyButton}
              onClick={() => handleCopy(accountInfo.accountNumber, "계좌번호")}
            >
              복사
            </button>
          </div>
        </div>
        <div className={styles.infoRow}>
          <span>입금금액</span>
          <strong>{accountInfo.amount.toLocaleString()}원</strong>
        </div>
        <div className={styles.infoRow}>
          <span>입금기한</span>
          <strong className={styles.dueDate}>{accountInfo.dueDate}</strong>
        </div>
      </div>

      <p className={styles.notice}>
        * 입금기한이 지나면 예약은 자동으로 취소됩니다.
      </p>

      <div className={styles.helpBox}>
        <p className={styles.helpText}>문제가 있으신가요?</p>
        <Link to="/contact" className={styles.contactLink}>
          <span className={styles.icon}>💬</span> 담당자 문의
        </Link>
      </div>

      <Link to="/" className={styles.homeButton}>
        메인 페이지로 돌아가기
      </Link>
    </div>
  );
}
