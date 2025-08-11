import instance from "../../../lib/axios";

// 부스 목록 조회
export const getBooths = async (expoId) => {
  try {
    const response = await instance.get(`/expos/${expoId}/booths`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "부스 목록 조회 중 오류 발생";
    throw new Error(message);
  }
};

// 부스 등록
export const registerBooth = async (expoId, data) => {
  try {
    const response = await instance.post(`/expos/${expoId}/booths`, data);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "부스 등록 중 오류 발생";
    throw new Error(message);
  }
};

// 부스 수정
export const updateBooth = async (expoId, boothId, data) => {
  try {
    const response = await instance.put(`/expos/${expoId}/booths/${boothId}`, data);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "부스 수정 중 오류 발생";
    throw new Error(message);
  }
};

// 부스 삭제
export const deleteBooth = async (expoId, boothId) => {
  try {
    await instance.delete(`/expos/${expoId}/booths/${boothId}`);
  } catch (error) {
    const message = error.response?.data?.message || "부스 삭제 중 오류 발생";
    throw new Error(message);
  }
};
