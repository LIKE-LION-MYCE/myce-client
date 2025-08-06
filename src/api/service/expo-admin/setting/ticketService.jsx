import instance from "../../../lib/axios";

export const getMyExpoTickets = async () => {
  try {
    const response = await instance.get("/expo-admin/my-expo/tickets");
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "티켓 조회 중 오류 발생";
    throw new Error(message);
  }
};

export const saveMyExpoTicket = async (data) => {
  try {
    const response = await instance.post("/expo-admin/my-expo/tickets", data);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "티켓 등록 중 오류 발생";
    throw new Error(message);
  }
};

export const deleteMyExpoTicket = async (ticketId) => {
  try {
    await instance.delete(`/expo-admin/my-expo/tickets/${ticketId}`);
  } catch (error) {
    const message = error.response?.data?.message || "티켓 삭제 중 오류 발생";
    throw new Error(message);
  }
};

export const updateMyExpoTicket = async (ticketId,data) => {
  try {
    const response = await instance.put(`/expo-admin/my-expo/tickets/${ticketId}`,data);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "티켓 수정 중 오류 발생";
    throw new Error(message);
  }
};