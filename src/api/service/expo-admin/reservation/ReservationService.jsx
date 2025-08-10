import instance from "../../../lib/axios";

export const getMyExpoReservation = async (expoId, page, size, entranceStatus, name, phone, reservationCode, ticketName) => {
  try {
    const response = await instance.get(`/expos/${expoId}/reservations`,{
        params:{
            page,
            size,
            entranceStatus,
            name,
            phone,
            reservationCode,
            ticketName
        }
    });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "예약자 내역 조회 중 오류 발생";
    throw new Error(message);
  }
};