import instance from "../../lib/axios";

const MEMBER_PREFIX = "/members/my-page";

export const getMemberInfo = async () => {
  return await instance.get(`${MEMBER_PREFIX}/info`);
};

export const getSettings = async () => {
  return await instance.get(`${MEMBER_PREFIX}/settings`);
};

export const updateSettings = async (settings) => {
  return await instance.put(`${MEMBER_PREFIX}/settings`, settings);
};

export const getReservedExpos = async () => {
  return await instance.get(`${MEMBER_PREFIX}/reserved-expos`);
};

export const getPaymentHistory = async (page = 0, size = 8, sort = 'createdAt,desc') => {
  return await instance.get(`${MEMBER_PREFIX}/payment-history`, {
    params: { page, size, sort }
  });
};

export const getFavoriteExpos = async () => {
  return await instance.get(`${MEMBER_PREFIX}/favorite_expos`);
};

export const getMyExpos = async () => {
  return await instance.get(`${MEMBER_PREFIX}/expos`);
};

export const getMyExpo = async (expoId) => {
  return await instance.get(`${MEMBER_PREFIX}/expos/${expoId}`);
};

export const deleteMyExpo = async (expoId) => {
  return await instance.delete(`${MEMBER_PREFIX}/expos/${expoId}`);
};

export const updateMemberInfo = async (memberInfo) => {
  return await instance.put(`${MEMBER_PREFIX}/info`, memberInfo);
};

export const withdrawMember = async () => {
  return await instance.delete('/members/withdraw');
};