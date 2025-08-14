import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ExpoCardList.module.css";
import { FiBookmark, FiBookmark as FiBookmarkFill } from "react-icons/fi";

export default function ExpoCardList({ expos, isLoading, error }) {
  const [internalExpos, setInternalExpos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (expos) {
      setInternalExpos(expos.map((expo) => ({ ...expo, isBookmark: false })));
    }
  }, [expos]);

  const handleBookmarkToggle = (e, expoId) => {
    e.stopPropagation();
    setInternalExpos((prevExpos) =>
      prevExpos.map((expo) =>
        expo.expoId === expoId
          ? { ...expo, isBookmark: !expo.isBookmark }
          : expo
      )
    );
  };

  const handleCardClick = (expoId) => {
    navigate(`/detail/${expoId}`);
  };

  const toDotDate = (input) => {
    if (!input) return "";
    if (typeof input === "string") {
      const d = input.slice(0, 10);
      return d.replace(/-/g, ".");
    }
    const date = new Date(input);
    if (Number.isNaN(date.getTime())) return "";
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}.${mm}.${dd}`;
  };

  if (isLoading) {
    return <div className={styles.loading}>박람회 불러오는 중</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error.message}</div>;
  }

  if (!internalExpos || internalExpos.length === 0) {
    return <div className={styles.noResults}>박람회가 없습니다.</div>;
  }

  return (
    <div className={styles.grid}>
      {internalExpos.map((expo) => (
        <div
          key={expo.expoId}
          className={styles.card}
          onClick={() => handleCardClick(expo.expoId)}
        >
          <img
            src={expo.thumbnailUrl}
            alt={expo.title}
            className={styles.thumbnail}
          />
          <div className={styles.overlay}>
            <h3 className={styles.title}>{expo.title}</h3>
            <p className={styles.remain}>
              남은 티켓 수량 : {expo.remainingQuantity}개
            </p>
            <p className={styles.location}>
              {expo.location} {expo.locationDetail}
            </p>
            <p className={styles.date}>
              {toDotDate(expo.startDate)} ~ {toDotDate(expo.endDate)}
            </p>
          </div>
          <button
            className={styles.bookmark}
            onClick={(e) => handleBookmarkToggle(e, expo.expoId)}
            aria-label="즐겨찾기 토글"
          >
            {expo.isBookmark ? (
              <FiBookmarkFill size={20} fill="white" />
            ) : (
              <FiBookmark size={20} />
            )}
          </button>
        </div>
      ))}
    </div>
  );
}
