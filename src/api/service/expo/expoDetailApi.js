import instance from "../../lib/axios";

// 박람회 기본 정보 조회
export const getExpoBasicInfo = async (expoId) => {
  const response = await instance.get(`/expos/${expoId}/basic`);
  return response.data;
};

// 박람회 티켓 정보 조회
export const getExpoTickets = async (expoId) => {
  const response = await instance.get(`/expos/${expoId}/tickets/reservations`);
  return response.data;
};

// 박람회 찜하기 상태 조회
export const getExpoBookmarkStatus = async (expoId) => {
  const response = await instance.get(`/expos/${expoId}/bookmark`);
  return response.data;
};

// 박람회 리뷰 정보 조회
export const getExpoReviews = async (expoId, page = 0, size = 10) => {
  const response = await instance.get(`/expos/${expoId}/reviews`, {
    params: { page, size }
  });
  return response.data;
};

// 박람회 위치 정보 조회
export const getExpoLocation = async (expoId) => {
  const response = await instance.get(`/expos/${expoId}/location`);
  return response.data;
};

// 박람회 부스 정보 조회 (공개용)
export const getExpoBooths = async (expoId) => {
  const response = await instance.get(`/expos/${expoId}/booths/public`);
  return response.data;
};

// 찜하기 토글 (추후 구현)
export const toggleExpoBookmark = async (expoId) => {
  const response = await instance.post(`/expos/${expoId}/bookmark/toggle`);
  return response.data;
};

// 티켓 예약 대기 생성
export const createReservationPending = async (reservationData) => {
  const response = await instance.post('/reservations/pending', reservationData);
  return response.data;
};

// 예약자 정보 해결
export const resolveReservers = async (reserverData) => {
  const response = await instance.post('/reservations/resolvers', reserverData);
  return response.data;
};

// 예약 확정
export const confirmReservation = async (reservationId) => {
  const response = await instance.patch(`/reservations/${reservationId}/confirm`);
  return response.data;
};

// 예약 성공 정보 조회
export const getReservationSuccess = async (reservationId) => {
  const response = await instance.get(`/reservations/${reservationId}/success`);
  return response.data;
};