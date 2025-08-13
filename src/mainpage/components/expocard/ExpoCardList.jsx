import React from "react";
import { Link } from "react-router-dom";
import styles from "./ExpoCardList.module.css";

export default function ExpoCardList({ expos, isLoading, error }) {
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

  if (!expos || expos.length === 0) {
    return <div className={styles.noResults}>박람회가 없습니다.</div>;
  }

  return (
    <div className={styles.grid}>
      {expos.map((expo) => (
        <div key={expo.id} className={styles.card}>
          <Link to={`/detail/${expo.id}`} className={styles.link}>
            <img
              src={expo.thumbnail}
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
          </Link>
        </div>
      ))}
    </div>
  );
}
