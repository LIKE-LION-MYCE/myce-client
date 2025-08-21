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

  // 모든 캐시 갱신
  async refreshAllCache(expoId) {
    try {
      const API_BASE_URL = `/expos/${expoId}/dashboard`;
      const response = await axios.post(`${API_BASE_URL}/cache/refresh`);
      return response.data;
    } catch (error) {
      console.error('전체 캐시 갱신 실패:', error);
      throw error;
    }
  },

  // 모든 캐시 완전 삭제
  async clearAllCache(expoId) {
    try {
      const API_BASE_URL = `/expos/${expoId}/dashboard`;
      const response = await axios.delete(`${API_BASE_URL}/cache/clear`);
      return response.data;
    } catch (error) {
      console.error('전체 캐시 삭제 실패:', error);
      throw error;
    }
  },

  // 개별 캐시 갱신들 (통합된 엔드포인트로 리다이렉트)
  async refreshReservationCache(expoId) {
    return this.refreshAllCache(expoId);
  },

  async refreshCheckinCache(expoId) {
    return this.refreshAllCache(expoId);
  },

  async refreshPaymentCache(expoId) {
    return this.refreshAllCache(expoId);
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
  },

  // 특정 날짜의 시간대별 입장인원 조회
  async getHourlyCheckinsByDate(expoId, date) {
    try {
      const API_BASE_URL = `/expos/${expoId}/dashboard`;
      const response = await axios.get(`${API_BASE_URL}/checkins/hourly`, {
        params: {
          date: date
        }
      });
      return response.data;
    } catch (error) {
      console.error('시간대별 입장인원 조회 실패:', error);
      throw error;
    }
  }
};

export default DashboardService;