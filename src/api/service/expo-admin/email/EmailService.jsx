import instance from '../../../lib/axios';

// 이메일 전송
export const sendExpoAdminEmail = async (expoId, dto, params = {}) => {
  try {
    const res = await instance.post(
      `/expos/${expoId}/emails`,
      dto,
      {
        params,
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return res.data;
  } catch (error) {
    const message = error.response?.data?.message || '이메일 전송 중 오류 발생';
    throw new Error(message);
  }
};


// 이메일 목록 조회
export const getMyEmails = async (expoId, page, size, sort, keyword) => {
  try {
    const response = await instance.get(`/expos/${expoId}/emails`, {
      params: {
        page,
        size,
        sort,      
        keyword,
      },
    });
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message || "이메일 목록 조회 중 오류 발생";
    throw new Error(message);
  }
};

//이메일 목록 상세 조회
export const getMyEmailDetail = async (expoId, emailId) => {
  try {
    const response = await instance.get(`/expos/${expoId}/emails/${emailId}`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "이메일 목록 상세 조회 중 오류 발생";
    throw new Error(message);
  }
};