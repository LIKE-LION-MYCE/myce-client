import instance from "../../lib/axios";

export const getReservationDetail = async (reservationId) => {
  return await instance.get(`/reservations/${reservationId}`);
};

export const updateReservers = async (reservationId, reserverInfos) => {
  return await instance.put(`/reservations/${reservationId}/reservers`, {
    reserverInfos
  });
};