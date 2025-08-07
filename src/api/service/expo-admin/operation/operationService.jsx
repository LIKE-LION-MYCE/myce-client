import instance from "../../../lib/axios";

//운영사 정보 조회
export const getMyBusinessProfile = async (expoId) => {
  try {
    const response = await instance.get(`/expos/${expoId}/profile`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "운영사 정보 조회 중 오류 발생";
    throw new Error(message);
  }
};

//운영사 정보 수정
export const updateMyBusinessProfile = async (expoId, form) => {
  try {
    const response = await instance.put(`/expos/${expoId}/profile`,form);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "운영사 정보 수정 중 오류 발생";
    throw new Error(message);
  }
};