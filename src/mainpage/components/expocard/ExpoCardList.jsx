import React from "react";
import { Link } from "react-router-dom";
import styles from "./ExpoCardList.module.css";

export default function ExpoCardList({ expos, isLoading, error }) {
  if (isLoading) {
    return <div className={styles.loading}>Loading expos...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error.message}</div>;
  }

  if (!expos || expos.length === 0) {
    return <div className={styles.noResults}>No expos found.</div>;
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
              <p className={styles.remain}>{expo.remain_ticket}</p>
              <p className={styles.location}>{expo.location}</p>
              <p className={styles.date}>{expo.date}</p>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
