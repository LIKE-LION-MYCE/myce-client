import instance from "../../lib/axios";

export const getMyExpos = async () => {
  try {
    const response = await instance.get("/expos/my");
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "현재 관리 중인 박람회 조회 중 오류 발생";
    throw new Error(message);
  }
};