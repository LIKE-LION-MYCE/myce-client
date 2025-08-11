import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MySavedExpoPage.module.css";
import { getFavoriteExpos } from "../../../api/service/user/memberApi";

function SavedExpoCard({ expo }) {
  const navigate = useNavigate();

  // 카드 클릭 시 상세 페이지 이동
  const handleCardClick = () => {
    navigate(`/detail/${expo.expoId}`);
  };

  // 날짜 포맷 함수
  const formatDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return 'N/A';
    const start = new Date(startDate).toLocaleDateString('ko-KR');
    const end = new Date(endDate).toLocaleDateString('ko-KR');
    return `${start} ~ ${end}`;
  };

  const location = expo.locationDetail ? 
    `${expo.location} (${expo.locationDetail})` : 
    expo.location;

  // 상세 페이지 이동 또는 찜 해제 기능 필요 시 추가
  return (
    <div
      className={styles.card}
      onClick={handleCardClick}
      style={{ cursor: "pointer" }} // 추가!
      tabIndex={0} // 키보드 접근성
      role="button"
      aria-label={`${expo.title} 상세보기`}
    >
      <div className={styles.info}>
        <h3>{expo.title}</h3>
        <div className={styles.detailBlock}>
          <div>
            <div className={styles.detailLabel}>행사 기간</div>
            <div className={styles.detailValue}>{formatDateRange(expo.startDate, expo.endDate)}</div>
          </div>
          <div>
            <div className={styles.detailLabel}>행사 위치</div>
            <div className={styles.detailValue}>{location}</div>
          </div>
        </div>
      </div>
      <img
        src={expo.thumbnailUrl || '/default-expo-image.jpg'}
        alt={expo.title + " 포스터"}
        className={styles.poster}
      />
    </div>
  );
}

const MySavedExpoPage = () => {
  const [favoriteExpos, setFavoriteExpos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFavoriteExpos();
  }, []);

  const fetchFavoriteExpos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getFavoriteExpos();
      setFavoriteExpos(response.data || []);
    } catch (err) {
      console.error('찜한 박람회 조회 실패:', err);
      setError('찜한 박람회를 불러오는데 실패했습니다.');
      setFavoriteExpos([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <h2 className={styles.pageTitle}>찜한 박람회</h2>
        <div className={styles.loading}>로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.wrapper}>
        <h2 className={styles.pageTitle}>찜한 박람회</h2>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.pageTitle}>찜한 박람회</h2>
      {favoriteExpos.length > 0 ? (
        <div className={styles.list}>
          {favoriteExpos.map((expo) => (
            <SavedExpoCard key={expo.expoId} expo={expo} />
          ))}
        </div>
      ) : (
        <div className={styles.noData}>찜한 박람회가 없습니다.</div>
      )}
    </div>
  );
};

export default MySavedExpoPage;
