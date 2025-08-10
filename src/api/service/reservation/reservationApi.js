import instance from "../../lib/axios";

export const getReservationDetail = async (reservationCode) => {
  return await instance.get(`/reservations/${reservationCode}`);
};