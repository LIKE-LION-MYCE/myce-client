import instance from "../../lib/axios";

export const updateAdPaymentInfoStatus = async (adId, paymentStatus) => {
  // 백엔드 DTO: { "paymentStatus": "<ENUM>" }
  await instance.patch(`/payment/${adId}/status`, {
    paymentStatus,
  });
};
