import instance from "../../lib/axios";

export const getReservationDetail = async (reservationCode) => {
  return await instance.get(`/reservations/${reservationCode}`);
};

export const updateReservers = async (reservationCode, reserverInfos) => {
  return await instance.put(`/reservations/${reservationCode}/reservers`, {
    reserverInfos,
  });
};

// 결제 전에 먼저 resolve 호출
export const resolveReservers = async (reserverInfos) => {
  const { data } = await instance.post("/reservations/resolvers", {
    reserverInfos,
  });
  return data.reserverInfos; // 배열 반환
};

// pending reservation 저장 후 reservation id 반환
export const saveReservationPending = async (payload) => {
  const res = await instance.post("/reservations/pending", payload);
  return res.data;
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
