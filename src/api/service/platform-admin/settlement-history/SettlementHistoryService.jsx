import instance from '../../../lib/axios';

// 전체 조회 API
export const fetchAllPaymentInfo = async ({ page, latestFirst, isApply }) => {
    const params = { page, latestFirst, isApply };
    const res = await instance.get('/platform/payment-info', { params });
    return res.data;
};

// 필터 조회 API
export const fetchFilteredPaymentInfo = async ({ page, latestFirst, keyword, type, startDate, endDate }) => {
    const params = { page, latestFirst, keyword, type, startDate, endDate };
    const res = await instance.get('/platform/payment-info/filter', { params });
    return res.data;
};

export const callExcelDownload = async ({ keyword, type, startDate, endDate }) => {
    const params = { keyword, type, startDate, endDate };
    const res = await instance.get('/platform/payment-info/excel-download',
        {
            params: params,
            responseType: 'blob'
        });
    return res;
};