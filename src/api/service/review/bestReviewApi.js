import instance from "../../lib/axios";

/**
 * 베스트 리뷰 조회 API
 */

// 베스트 리뷰 6개 조회 (평점 높고 최신순)
export const getBestReviews = async (limit = 6) => {
  try {
    const response = await instance.get(`/reviews/best?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error("베스트 리뷰 조회 실패:", error);
    throw error;
  }
};

// 리뷰 데이터를 BestReviews 컴포넌트 형식에 맞게 변환
export const transformReviewData = (reviewData) => {
  if (!reviewData || !reviewData.reviews) {
    return [];
  }

  return reviewData.reviews.map((review) => ({
    id: review.id,
    type: 'text', // 현재 DB에는 이미지 정보가 없어서 모두 text로 처리
    rating: review.rating,
    author: maskAuthorName(review.memberName), // 작성자명 마스킹
    title: review.title,
    content: truncateContent(review.content, 150), // 내용 요약
    genre: review.expoTitle, // 박람회 제목
    expoId: review.expoId,
    createdAt: review.createdAt
  }));
};

// 작성자명 마스킹 (예: "홍길동" -> "홍**")
const maskAuthorName = (name) => {
  if (!name || name.length <= 1) return name;
  
  if (name.length === 2) {
    return name[0] + '*';
  }
  
  return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
};

// 내용 요약 (글자 수 제한)
const truncateContent = (content, maxLength) => {
  if (!content) return '';
  
  if (content.length <= maxLength) {
    return content;
  }
  
  return content.substring(0, maxLength) + '...';
};