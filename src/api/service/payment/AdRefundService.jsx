import instance from "../../lib/axios";

export const processAdRefund = async (adRefundData) => {
  const response = await instance.post("/payment/ad-refund", adRefundData);
  return response.data;
};
