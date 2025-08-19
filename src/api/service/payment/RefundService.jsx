import instance from "../../lib/axios";

export const requestRefund = async (refundData) => {
  await instance.post("/payment/refund", refundData);
};

export const getImpUid = async (paymentTargetType, targetId) => {
  const res = await instance.post("/payment/imp-uid", {
    paymentTargetType,
    targetId,
  });
  return res.data;
};