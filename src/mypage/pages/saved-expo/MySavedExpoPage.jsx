import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MySavedExpoPage.module.css";

const savedExpos = [
  {
    id: 1,
    expoName: "2024 서울 모터쇼",
    date: "2024-02-15 ~ 2024-02-28",
    location: "남양대교",
    posterUrl:
      "https://mblogthumb-phinf.pstatic.net/MjAyNDAzMjFfMTU5/MDAxNzExMDA1ODI4MTQw.psQX0d6NIIndrBZEQG5hYpU7lEzdUL7MKTi26EN0VdAg.nCl1urMS90FJqqYkUYhTn1udIBHVy5gSi6dfgvne2vUg.JPEG/NMF2024_4.jpg?type=w800",
  },
  {
    id: 2,
    expoName: "디지털 헬스케어 박람회",
    date: "2024-02-15 ~ 2024-02-28",
    location: "강원도 원주 인터불고호텔",
    posterUrl:
      "https://mblogthumb-phinf.pstatic.net/MjAyNDAzMjFfMTU5/MDAxNzExMDA1ODI4MTQw.psQX0d6NIIndrBZEQG5hYpU7lEzdUL7MKTi26EN0VdAg.nCl1urMS90FJqqYkUYhTn1udIBHVy5gSi6dfgvne2vUg.JPEG/NMF2024_4.jpg?type=w800",
  },
];

function SavedExpoCard({ expo }) {
  const navigate = useNavigate();

  // 카드 클릭 시 상세 페이지 이동
  const handleCardClick = () => {
    navigate(`/detail/${expo.id}`);
  };

  // 상세 페이지 이동 또는 찜 해제 기능 필요 시 추가
  return (
    <div
      className={styles.card}
      onClick={handleCardClick}
      style={{ cursor: "pointer" }} // 추가!
      tabIndex={0} // 키보드 접근성
      role="button"
      aria-label={`${expo.expoName} 상세보기`}
    >
      <div className={styles.info}>
        <h3>{expo.expoName}</h3>
        <div className={styles.detailBlock}>
          <div>
            <div className={styles.detailLabel}>행사 기간</div>
            <div className={styles.detailValue}>{expo.date}</div>
          </div>
          <div>
            <div className={styles.detailLabel}>행사 위치</div>
            <div className={styles.detailValue}>{expo.location}</div>
          </div>
        </div>
      </div>
      <img
        src={expo.posterUrl}
        alt={expo.expoName + " 포스터"}
        className={styles.poster}
      />
    </div>
  );
}

const MySavedExpoPage = () => {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.pageTitle}>찜한 박람회</h2>
      <div className={styles.list}>
        {savedExpos.map((expo) => (
          <SavedExpoCard key={expo.id} expo={expo} />
        ))}
      </div>
    </div>
  );
};

export default MySavedExpoPage;
