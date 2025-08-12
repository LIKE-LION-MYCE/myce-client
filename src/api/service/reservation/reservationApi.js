import instance from "../../lib/axios";

export const getReservationDetail = async (reservationCode) => {
  return await instance.get(`/reservations/${reservationCode}`);
};

export const updateReservers = async (reservationCode, reserverInfos) => {
  return await instance.put(`/reservations/${reservationCode}/reservers`, {
    reserverInfos
  });
};