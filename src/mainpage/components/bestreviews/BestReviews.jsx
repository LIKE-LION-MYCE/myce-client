
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ReviewCard from '../reviewcard/ReviewCard';
import styles from './BestReviews.module.css';
import { getBestReviews, transformReviewData } from '../../../api/service/review/bestReviewApi';
// 메인 i18n.js에서 모든 리소스를 병합하므로 별도 import 불필요

const BestReviews = ({
  reviews: propReviews,
  onReviewClick,
  onRefresh
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 기본 데이터 (API 실패 시 사용)
  const defaultReviews = [
    {
      id: 1,
      type: 'text',
      rating: 9.9,
      author: 'jeongha***',
      title: '한 번의 연극이 내 번의 인생을 안겨주었다',
      content: '연극을 참 많이보면 한 번의 인생을 더 살 것"이라는 말을 참 좋아하는데, 연극도 마찬가지고 생각한다. 특히 배우들의 생생한 연기는 책 속 문장으로 감춘다면, 이 연극은 그 나이의 청춘이 정말 헌신적인 우정과 사랑, 갈등을 아주 섬세하게 그려내서 공감이 컸고, 극복이에 웃 ...',
      genre: '평점9.9★ 연극 〈남시전 여시전〉(시월 vs 우경) 원실관람 코코',
    },
    {
      id: 2,
      type: 'image',
      rating: 9.9,
      author: 'qewooh***',
      title: '어리? 어라라! 이렇게 좋은 뮤지컬이~',
      content: '고등과 여경들 이거니고, 시향 언어서 진짜한 자극을 갈구하는 프리다의 모습이 너무나 마음에 와닿았습니다! 벌써차원 자유로워진 그녀의 멜로이 이어들의 연기 어디가에서 느끼기는 것 같습니다.',
      genre: '뮤지컬 〈프리다〉',
    },
    {
      id: 3,
      type: 'text',
      rating: 9.5,
      author: 'milly***',
      title: '신선하고 의미있는 공연',
      content: '감만에 의미있는 공연 봤습니다. 스토리도 신선하고 젠더벤딩 캐스팅이 의미있었요. 청신함 우층을 둠에 관심이 많다면 더 의미 있을 것 같아요. 제작자가 어떤토도 참 안하고 흥보를 아하는지 제가 간 최석는 예매자분대 초대관이 많은 기분이었네요ㅎㅎ 저 같이 완각해서 많이 보면 족간아요! 다...',
      genre: '연극 디 이펙트(THE EFFECT)〉',
    },
    {
      id: 4,
      type: 'image',
      rating: 9.8,
      author: 'byu980***',
      title: '부모님이랑 같이 봐도 좋은 극',
      content: '엄마와 같이 관극하게 되었는데 엄마가 같이 봐도 너무나무 좋은 극 같다다! 두황제의 아름다운 이야기 너무나무 좋 붇습니다! 벼도도 너무 좋고 극 자체도 너무 좋았어요! 넘버가 운동주 시간대 운동주 시간의 시료 되어 있는 것 또한 너무 좋았습니다!',
      genre: '뮤지컬 민들레바라',
    }
  ];

  // 베스트 리뷰 로드
  const loadBestReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const reviewData = await getBestReviews(6);
      const transformedReviews = transformReviewData(reviewData);
      
      if (transformedReviews.length > 0) {
        setReviews(transformedReviews);
      } else {
        setReviews(defaultReviews); // 데이터가 없으면 기본 데이터 사용
      }
    } catch (err) {
      console.error('베스트 리뷰 로드 실패:', err);
      setError(err.message);
      setReviews(defaultReviews); // 에러 시 기본 데이터 사용
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (propReviews) {
      setReviews(propReviews);
    } else {
      loadBestReviews();
    }
  }, [propReviews]);

  const displayReviews = propReviews || reviews;

  const handleReviewClick = (review) => {
    console.log('Review clicked:', review);
    if (onReviewClick) {
      onReviewClick(review);
    } else if (review.expoId) {
      // 해당 박람회 상세 페이지의 리뷰 섹션으로 이동
      navigate(`/detail/${review.expoId}#reviews`);
    }
  };

  const handleRefresh = () => {
    console.log('Refresh clicked');
    if (onRefresh) {
      onRefresh();
    } else {
      loadBestReviews(); // 새로 베스트 리뷰 로드
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t("homepage.bestReviews.title", "베스트 관람후기")}</h2>
      
      {loading && (
        <div className={styles.loading}>{t("homepage.bestReviews.loading", "리뷰를 불러오는 중...")}</div>
      )}
      
      {error && (
        <div className={styles.error}>{t("homepage.bestReviews.error", "리뷰를 불러오는데 실패했습니다.")}</div>
      )}
      
      <div className={styles.reviewsGrid}>
        {displayReviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            onClick={handleReviewClick}
          />
        ))}
      </div>
      
      <div className={styles.buttonContainer}>
        <button className={styles.moreButton} onClick={handleRefresh}>
          <span className={styles.refreshIcon}>↻</span>
          {t("homepage.bestReviews.refreshButton", "관람후기 새로 보기")}
        </button>
      </div>
    </div>
  );
};

export default BestReviews;