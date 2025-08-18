import instance from '../../lib/axios';

const API_BASE_URL = '/reviews';

export const reviewAPI = {
  // 리뷰 작성
  createReview: async (reviewData) => {
    const response = await instance.post(API_BASE_URL, reviewData);
    return { success: true, data: response.data };
  },

  // 박람회별 리뷰 목록 조회
  getReviewsByExpo: async (expoId, sortBy = 'latest', page = 0, size = 10) => {
    const response = await instance.get(`${API_BASE_URL}/expo/${expoId}`, {
      params: { sortBy, page, size }
    });
    return { success: true, data: response.data };
  },

  // 리뷰 상세 조회
  getReviewById: async (reviewId) => {
    const response = await instance.get(`${API_BASE_URL}/${reviewId}`);
    return { success: true, data: response.data };
  },

  // 리뷰 수정
  updateReview: async (reviewId, reviewData) => {
    const response = await instance.put(`${API_BASE_URL}/${reviewId}`, reviewData);
    return { success: true, data: response.data };
  },

  // 리뷰 삭제
  deleteReview: async (reviewId) => {
    const response = await instance.delete(`${API_BASE_URL}/${reviewId}`);
    return { success: true, data: response.data };
  },

  // 내 리뷰 목록 조회
  getMyReviews: async (page = 0, size = 10) => {
    const response = await instance.get(`${API_BASE_URL}/my`, {
      params: { page, size }
    });
    return { success: true, data: response.data };
  },

  // 박람회 참석 여부 확인
  checkAttendance: async (expoId) => {
    const response = await instance.get(`${API_BASE_URL}/check-attendance/${expoId}`);
    return { success: true, data: response.data };
  },

  // 리뷰 작성 여부 확인
  checkReviewed: async (expoId) => {
    const response = await instance.get(`${API_BASE_URL}/check-reviewed/${expoId}`);
    return { success: true, data: response.data };
  }
};

export default reviewAPI;