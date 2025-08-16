import instance from "../../lib/axios";

const MEMBER_PREFIX = "/members/my-page";
const EXPO_PREFIX = "/members/expos";
const AD_PREFIX = "/members/ads";

export const getMemberInfo = async () => {
  return await instance.get(`${MEMBER_PREFIX}/info`);
};

export const getSettings = async () => {
  return await instance.get(`${MEMBER_PREFIX}/settings`);
};

export const updateSettings = async (settings) => {
  return await instance.put(`${MEMBER_PREFIX}/settings`, settings);
};

export const getReservedExpos = async (
  page = 0,
  size = 10,
  sort = "createdAt,desc"
) => {
  return await instance.get(`${MEMBER_PREFIX}/reserved-expos`, {
    params: { page, size, sort },
  });
};

export const getPaymentHistory = async (
  page = 0,
  size = 8,
  sort = "createdAt,desc"
) => {
  return await instance.get(`${MEMBER_PREFIX}/payment-history`, {
    params: { page, size, sort },
  });
};

export const getFavoriteExpos = async () => {
  return await instance.get(`${MEMBER_PREFIX}/favorite-expos`);
};

export const getMyExpos = async (
  page = 0,
  size = 5,
  sort = "createdAt,desc"
) => {
  return await instance.get(`${EXPO_PREFIX}`, {
    params: { page, size, sort },
  });
};

export const getMyExpo = async (expoId) => {
  return await instance.get(`${EXPO_PREFIX}/${expoId}`);
};

export const deleteMyExpo = async (expoId) => {
  return await instance.delete(`${EXPO_PREFIX}/${expoId}`);
};

export const updateMemberInfo = async (memberInfo) => {
  return await instance.put(`${MEMBER_PREFIX}/info`, memberInfo);
};

export const withdrawMember = async () => {
  return await instance.delete("/members/withdraw");
};

// Expo related APIs
export const getExpoPaymentDetail = async (expoId) => {
  return await instance.get(`${EXPO_PREFIX}/${expoId}/payment`);
};

export const getExpoAdminCodes = async (expoId) => {
  return await instance.get(`${EXPO_PREFIX}/${expoId}/admin-codes`);
};

export const getExpoSettlementReceipt = async (expoId) => {
  return await instance.get(`${EXPO_PREFIX}/${expoId}/settlement-receipt`);
};

export const requestExpoSettlement = async (expoId, settlementData) => {
  return await instance.post(`${EXPO_PREFIX}/${expoId}/settlement`, settlementData);
};

export const completeExpoPayment = async (expoId) => {
  return await instance.post(`${EXPO_PREFIX}/${expoId}/payment-complete`);
};

export const getExpoRefundReceipt = async (expoId) => {
  return await instance.get(`${EXPO_PREFIX}/${expoId}/refund-receipt`);
};

export const getExpoRefundHistory = async (expoId) => {
  return await instance.get(`${EXPO_PREFIX}/${expoId}/refund-history`);
};

export const requestExpoRefund = async (expoId, refundRequest) => {
  return await instance.post(`${EXPO_PREFIX}/${expoId}/refund-request`, refundRequest);
};

// Advertisement related APIs
export const getMyAdvertisements = async (page = 0, size = 10) => {
  return await instance.get(`${AD_PREFIX}`, {
    params: { page, size },
  });
};

export const getAdvertisementDetail = async (advertisementId) => {
  return await instance.get(`${AD_PREFIX}/${advertisementId}`);
};

export const getAdvertisementPayment = async (advertisementId) => {
  return await instance.get(`${AD_PREFIX}/${advertisementId}/payment`);
};

export const getAdvertisementRefundReceipt = async (advertisementId) => {
  return await instance.get(`${AD_PREFIX}/${advertisementId}/refund-receipt`);
};

export const getAdvertisementRefundHistory = async (advertisementId) => {
  return await instance.get(`${AD_PREFIX}/${advertisementId}/refund-history`);
};

export const getAdvertisementRejectInfo = async (advertisementId) => {
  return await instance.get(`${AD_PREFIX}/${advertisementId}/reject-info`);
};

export const completeAdvertisementPayment = async (advertisementId) => {
  return await instance.post(`${AD_PREFIX}/${advertisementId}/payment/complete`);
};

export const deleteAdvertisement = async (advertisementId) => {
  return await instance.delete(`${AD_PREFIX}/${advertisementId}`);
};

export const cancelAdvertisementByStatus = async (advertisementId) => {
  return await instance.post(
    `${AD_PREFIX}/${advertisementId}/cancel-by-status`
  );
};

export const requestAdvertisementRefundByStatus = async (
  advertisementId,
  refundRequest
) => {
  return await instance.post(
    `${AD_PREFIX}/${advertisementId}/refund-request-by-status`,
    refundRequest
  );
};

export const getMyInfo = async () => {
  return await instance.get("/members/my-info");
};

export const getMyMileage = async () => {
  return await instance.get("/members/my-mileage");
};

export const updateGrade = async () => {
  await instance.patch("/members/grade");
};
