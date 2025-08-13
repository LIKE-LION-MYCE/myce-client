import instance from "../../../api/lib/axios";

export const getTicketsForReservation = async (expoId) => {
  try {
    const response = await instance.get(
      `/expos/${expoId}/tickets/reservations`
    );
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "티켓 조회 중 에러 발생";
    throw new Error(message);
  }
};

export const updateRemainingQuantity = async (ticketId, quantity) => {
  instance.patch({ ticketId, quantity });
};
