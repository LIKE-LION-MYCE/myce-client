import instance from '../../lib/axios';

// 예약 완료 시 QR 코드 즉시 생성
export const generateQrForReservation = async (reservationId) => {
  try {
    const response = await instance.post(`/qrcodes/reservation/${reservationId}/generate`);
    return response.data;
  } catch (error) {
    console.error('QR 코드 생성 실패:', error);
    throw error;
  }
};