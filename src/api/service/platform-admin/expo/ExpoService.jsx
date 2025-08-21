import instance from '../../../lib/axios';

// 박람회 신청 목록 조회 (전체)
export const fetchAllExpos = async ({ page, pageSize, latestFirst, status }) => {
  const params = { page, pageSize, latestFirst, status };
  const res = await instance.get('/platform/expo', { params });
  return res.data;
};

// 박람회 신청 목록 조회 (필터링)
export const fetchFilteredExpos = async ({ 
  page, 
  pageSize, 
  latestFirst, 
  keyword, 
  status 
}) => {
  const params = { page, pageSize, latestFirst, keyword, status };
  const res = await instance.get('/platform/expo/filter', { params });
  return res.data;
};

// 박람회 신청 상세 조회
export const fetchExpoDetail = async (expoId) => {
  const res = await instance.get(`/platform/expo/${expoId}`);
  return res.data;
};

// 박람회 신청 승인
export const approveExpo = async (expoId) => {
  const res = await instance.post(`/platform/expo/${expoId}/approve`);
  return res.data;
};

// 박람회 신청 거절
export const rejectExpo = async ({ id, reason }) => {
  const res = await instance.post(`/platform/expo/${id}/reject`, { reason });
  return res.data;
};

// 박람회 결제 정보 조회
export const fetchPaymentInfo = async (expoId) => {
  const res = await instance.get(`/platform/expo/${expoId}/payment`);
  return res.data;
};

// 박람회 승인 시 결제 정보 미리보기
export const fetchPaymentPreview = async (expoId) => {
  const res = await instance.get(`/platform/expo/${expoId}/payment-preview`);
  return res.data;
};

// 박람회 거절 정보 조회
export const fetchRejectInfo = async (expoId) => {
  const res = await instance.get(`/platform/expo/${expoId}/reject`);
  return res.data;
};

// 박람회 취소/환불 내역 조회
export const fetchCancelInfo = async (expoId) => {
  const res = await instance.get(`/platform/expo/${expoId}/cancel`);
  return res.data;
};

// 현재 박람회 목록 조회 (게시중, 취소 대기)
export const fetchCurrentExpos = async ({ page, pageSize, latestFirst, status, keyword }) => {
  const params = { page, pageSize, latestFirst, status, keyword };
  const res = await instance.get('/platform/expo/current', { params });
  return res.data;
};

// 박람회 취소 승인
export const approveCancellation = async (expoId) => {
  const res = await instance.post(`/platform/expo/${expoId}/cancel-approve`);
  return res.data;
};

// 박람회 정산 승인
export const approveSettlement = async (expoId) => {
  const res = await instance.post(`/platform/expo/${expoId}/settlement-approve`);
  return res.data;
};

// 박람회 정산 내역 조회
export const fetchSettlementDetail = async (expoId) => {
  const res = await instance.get(`/platform/expo/${expoId}/settlement`);
  return res.data;
};

export const fetchExpoAdminInfo = async (expoId) => {
  const res = await instance.get(`/platform/expo/${expoId}/admin-info`);
  return res.data;
}