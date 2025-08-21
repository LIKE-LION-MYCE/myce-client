import instance from "../../lib/axios";

export const getReservationDetail = async (reservationId) => {
  return await instance.get(`/reservations/${reservationId}`);
};

export const updateReservers = async (reservationId, reserverInfos) => {
  return await instance.put(`/reservations/${reservationId}/reservers`, {
    reserverInfos,
  });
};

// 비회원들 guestId 생성 및 guestId reservation에 추가
export const updateGuestId = async (reservationId, reserverInfos) => {
  await instance.patch("/reservations/guestId", {
    reservationId,
    reserverInfos,
  });
};

// confirm으로 상태 변경
export const updateReservationStatusConfirm = async (reservationId) => {
  await instance.patch(`/reservations/${reservationId}/confirm`, {});
};

// 결제 성공 화면 정보
export const getReservationSuccess = async (reservationId) => {
  const { data } = await instance.get(
    `/reservations/${reservationId}/success`,
    {}
  );
  return data;
};

// 결제 대기 화면 정보
export const getReservationPending = async (reservationId) => {
  const { data } = await instance.get(
    `/reservations/${reservationId}/pending`,
    {}
  );
  return data;
};

// 결제 전 사전 예약 정보 저장(reservation 생성하면서 CONFIRMED_PENDING 저장)
export const savePreReservation = async (preReservationData) => {
  const { data } = await instance.post(
    "/reservations/pre-reservation",
    preReservationData
  );
  return data;
};

// 사전 예약 정보 바탕으로 결제 요약 정보 가져오기
export const getPaymentSummary = async (preReservationId, sessionId = null) => {
  let url = `/reservations/payment-summary?preReservationId=${preReservationId}`;
  
  if (sessionId) {
    url += `&sessionId=${sessionId}`;
  }
  
  const { data } = await instance.get(url);
  return data;
};

// 결제 취소 or 결제 실패 시 reservation pending 상태 삭제
export const deleteReservationPending = async (reservationId) => {
  await instance.delete(`/reservations/${reservationId}`);
};

// 비회원 예매 조회 (이메일 + 예매번호)
export const getNonMemberReservation = async (email, reservationCode) => {
  const { data } = await instance.get("/reservations/guest", {
    params: {
      email,
      reservationCode
    }
  });
  return data;
};
