import instance from "../../../lib/axios";

// 티켓 목록 조회
export const getMyExpoTickets = async (expoId) => {
  try {
    const response = await instance.get(`/expos/${expoId}/tickets`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "티켓 조회 중 오류 발생";
    throw new Error(message);
  }
};

// 티켓 등록
export const saveMyExpoTicket = async (expoId, data) => {
  try {
    const response = await instance.post(`/expos/${expoId}/tickets`, data);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "티켓 등록 중 오류 발생";
    throw new Error(message);
  }
};

// 티켓 삭제
export const deleteMyExpoTicket = async (expoId, ticketId) => {
  try {
    await instance.delete(`/expos/${expoId}/tickets/${ticketId}`);
  } catch (error) {
    const message = error.response?.data?.message || "티켓 삭제 중 오류 발생";
    throw new Error(message);
  }
};

// 티켓 수정
export const updateMyExpoTicket = async (expoId, ticketId, data) => {
  try {
    const response = await instance.put(`/expos/${expoId}/tickets/${ticketId}`, data);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "티켓 수정 중 오류 발생";
    throw new Error(message);
  }
};