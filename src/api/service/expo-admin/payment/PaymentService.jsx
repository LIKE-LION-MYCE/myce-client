import instance from "../../../lib/axios";

// 결제 내역 조회
export const getExpoAdminPayment = async (expoId, page, sort, status, name, phone) => {
  try {
    const response = await instance.get(`/expos/${expoId}/payments`, {
      params: {
        page,
        size: 10,  
        sort,
        status: status ?? undefined,
        name: name ?? undefined,
        phone: phone ?? undefined,
      },
    });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "결제 내역 조회 중 오류 발생";
    throw new Error(message);
  }
};

// 결제 내역 상세 조회
export const getPaymentDetail = async (expoId, paymentId) => {
  try {
    const response = await instance.get(`/expos/${expoId}/payments/${paymentId}`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "결제 내역 상세 조회 중 오류 발생";
    throw new Error(message);
  }
};