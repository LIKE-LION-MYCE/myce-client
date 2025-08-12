import instance from "../../../lib/axios";

export const getMyExpoInfo = async (expoId) => {
  try {
    const response = await instance.get(`/expos/my/${expoId}`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "박람회 정보 조회 중 오류 발생";
    throw new Error(message);
  }
};

export const updateMyExpoInfo = async (expoId, data) => {
  try {
    const response = await instance.put(`/expos/my/${expoId}`, data);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "박람회 정보 수정 중 오류 발생";
    throw new Error(message);
  }
};
