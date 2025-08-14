import instance from "../../../lib/axios";

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
