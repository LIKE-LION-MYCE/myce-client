import instance from "../../lib/axios";

export const requestRefund = async (
  impUid,
  merchantUid,
  reason,
  cancelAmount
) => {
  const payload = {
    impUid,
    merchantUid,
    reason,
    cancelAmount,
  };
  await instance.post("/payment/refund", payload);
};
