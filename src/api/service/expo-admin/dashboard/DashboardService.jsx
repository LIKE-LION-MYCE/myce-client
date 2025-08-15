import axios from '../../../lib/axios';

const DashboardService = {
  // 전체 대시보드 데이터 조회
  async getExpoDashboard(expoId) {
    try {
      const API_BASE_URL = `/expos/${expoId}/dashboard`;
      const response = await axios.get(API_BASE_URL);
      return response.data;
    } catch (error) {
      console.error('대시보드 데이터 조회 실패:', error);
      throw error;
    }
  },

  // 예약 통계 캐시 갱신
  async refreshReservationCache(expoId) {
    try {
      const API_BASE_URL = `/expos/${expoId}/dashboard`;
      const response = await axios.post(`${API_BASE_URL}/cache/refresh/reservation`);
      return response.data;
    } catch (error) {
      console.error('예약 캐시 갱신 실패:', error);
      throw error;
    }
  },

  // 체크인 통계 캐시 갱신
  async refreshCheckinCache(expoId) {
    try {
      const API_BASE_URL = `/expos/${expoId}/dashboard`;
      const response = await axios.post(`${API_BASE_URL}/cache/refresh/checkin`);
      return response.data;
    } catch (error) {
      console.error('체크인 캐시 갱신 실패:', error);
      throw error;
    }
  },

  // 결제 통계 캐시 갱신
  async refreshPaymentCache(expoId) {
    try {
      const API_BASE_URL = `/expos/${expoId}/dashboard`;
      const response = await axios.post(`${API_BASE_URL}/cache/refresh/payment`);
      return response.data;
    } catch (error) {
      console.error('결제 캐시 갱신 실패:', error);
      throw error;
    }
  },

  // 모든 캐시 갱신
  async refreshAllCache(expoId) {
    try {
      const API_BASE_URL = `/expos/${expoId}/dashboard`;
      const response = await axios.post(`${API_BASE_URL}/cache/refresh/all`);
      return response.data;
    } catch (error) {
      console.error('전체 캐시 갱신 실패:', error);
      throw error;
    }
  },

  // 박람회 표시 기간 조회
  async getExpoDisplayDateRange(expoId) {
    try {
      const API_BASE_URL = `/expos/${expoId}/dashboard`;
      const response = await axios.get(`${API_BASE_URL}/expo-date-range`);
      return response.data;
    } catch (error) {
      console.error('박람회 표시 기간 조회 실패:', error);
      throw error;
    }
  },

  // 커스텀 날짜 범위로 일주일 예약 현황 조회
  async getWeeklyReservationsByDateRange(expoId, startDate, endDate) {
    try {
      const API_BASE_URL = `/expos/${expoId}/dashboard`;
      const response = await axios.get(`${API_BASE_URL}/reservations/weekly`, {
        params: {
          startDate: startDate,
          endDate: endDate
        }
      });
      return response.data;
    } catch (error) {
      console.error('커스텀 날짜 범위 예약 현황 조회 실패:', error);
      throw error;
    }
  }
};

export default DashboardService;