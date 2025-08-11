import instance from "../../../lib/axios";

//예약자 내역 조회
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

//박람회에 속한 티켓 목록 조회
export const getExpoTicketNames = async (expoId) => {
  try {
    const response = await instance.get(`/expos/${expoId}/reservations/ticket-name`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "티켓 정보 조회 중 오류 발생";
    throw new Error(message);
  }
};

//예약자 수기 입장 처리
export const updateReserverQrCodeForManualCheckIn = async (expoId, reserverId) => {
  try {
    const response = await instance.put(`/expos/${expoId}/reservers/${reserverId}/manual-checkin`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "수기 입장 처리 중 오류 발생";
    throw new Error(message);
  }
};