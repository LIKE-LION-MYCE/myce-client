import instance from '../../../lib/axios';

// 전체 조회 API
export const fetchAllApplyBanners = async ({ page, latestFirst }) => {
  const params = { page, latestFirst };
  const res = await instance.get('/platform/ads/list', { params });
  return res.data;
};

// 필터 조회 API
export const fetchFilteredApplyBanners = async ({ page, latestFirst, keyword, status }) => {
  const params = { page, latestFirst, keyword, status };
  const res = await instance.get('/platform/ads/list/filter', { params });
  return res.data;
};

export const fetchDetailApplyBanner = async ( bannerId ) => {
  const res = await instance.get(`/platform/ads/list/detail/${bannerId}`);
  return res.data;
}