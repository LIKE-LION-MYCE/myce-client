import instance from '../../../lib/axios';


export const fetchRejectInfo = async (bannerId) => {
    const res = await instance.get(`/platform/ads/list/detail/${bannerId}/reject`);
    return res.data;
}

export const rejectBanner = async ({ id, reason }) => {
    const res = await instance.post(`/platform/ads/list/detail/${id}/reject`, {reason});
}