import instance from '../../../lib/axios';

// 전체 조회 API
export const fetchAllBanners = async ({ page, latestFirst, isApply }) => {
  const params = { page, latestFirst, isApply };
  const res = await instance.get('/platform/ads/list', { params });
  return res.data;
};

// 필터 조회 API
export const fetchFilteredBanners = async ({ page, latestFirst, keyword, status, isApply }) => {
  const params = { page, latestFirst, keyword, status, isApply };
  const res = await instance.get('/platform/ads/list/filter', { params });
  return res.data;
};

export const fetchDetailBanner = async (bannerId) => {
  const res = await instance.get(`/platform/ads/list/detail/${bannerId}`);
  return res.data;
};

export const getCurrentBanner = async () => {
  const res = await instance.get(`/ads`);
  return res.data;
};

export const getPaymentInfo = async ( bannerId ) => {
  const res = await instance.get(`/platform/ads/list/detail/${bannerId}/payment-check`);
  return res.data;
};

export const approveBanner = async (bannerId, paymentInfo) => {
    const res = await instance.post(`/platform/ads/list/detail/${bannerId}/approve`, {paymentInfo});
}