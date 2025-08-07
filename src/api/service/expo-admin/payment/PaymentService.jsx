import instance from "../../../lib/axios";

//결제 내역 조회
export const getExpoAdminPayment = async (expoId) => {
  try {
    const response = await instance.get(`/expos/${expoId}/payments`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "결제 내역 조회 중 오류 발생";
    throw new Error(message);
  }
};