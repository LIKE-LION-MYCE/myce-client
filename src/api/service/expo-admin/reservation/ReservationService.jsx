import instance from "../../../lib/axios";

//예약자 내역 조회
export const getMyExpoReservation = async (
  expoId,
  page,
  size,
  entranceStatus,
  name,
  phone,
  reservationCode,
  ticketName
) => {
  try {
    const params = {
      page,
      size,
      entranceStatus,
      name: name?.trim(),
      phone: phone?.trim(),
      reservationCode: reservationCode?.trim(),
      ticketName: ticketName?.trim(), // ← 값만 정리(공백 제거). 인코딩은 serializer가 처리
    };

    // 빈 값은 제거
    Object.keys(params).forEach((k) => {
      if (params[k] === undefined || params[k] === null || params[k] === '') {
        delete params[k];
      }
    });

    const response = await instance.get(`/expos/${expoId}/reservations`, {
      params,
      // 여기서 한 번만 안전하게 인코딩 (대괄호/공백 포함)
      paramsSerializer: (p) =>
        Object.entries(p)
          .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
          .join('&'),
    });

    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || '예약자 내역 조회 중 오류 발생';
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

//예약자 QR 코드 재발급
export const reissueReserverQrCode = async (expoId, dto, params = {}) => {
  try {
    const res = await instance.post(
      `/expos/${expoId}/reservers/qr-reissue`,
      dto,
      {
        params,
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return res.data;
  } catch (error) {
    const message = error.response?.data?.message || '예약자 QR 코드 재발급 중 오류 발생';
    throw new Error(message);
  }
};

//예약자 엑셀 추출
export const downloadMyReservationExcelFile = async (expoId) => {
  try {
    const response = await instance.get(`/expos/${expoId}/reservations/excel-download`, {
      responseType: 'blob', 
    });
    return response;
  } catch (error) {
    const message = error.response?.data?.message || "엑셀 파일 다운로드 중 오류 발생";
    throw new Error(message);
  }
};