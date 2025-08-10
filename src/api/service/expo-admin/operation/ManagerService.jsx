import instance from "../../../lib/axios";

//관리자 정보 조회
export const getMyExpoManagers = async (expoId) => {
  try {
    const response = await instance.get(`/expos/${expoId}/managers`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "하위 관리자 정보 조회 중 오류 발생";
    throw new Error(message);
  }
};

//관리자 정보 수정
export const updateMyExpoManagers = async (expoId,data) => {
  try {
    const response = await instance.put(`/expos/${expoId}/managers`,data);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "하위 관리자 정보 수정 중 오류 발생";
    throw new Error(message);
  }
};