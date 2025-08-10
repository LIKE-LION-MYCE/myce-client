import instance from "../../../lib/axios";

//로그인한 사용자의 박람회 관리 권한 조회
export const getMyPermission = async () => {
  try {
    const response = await instance.get(`/expos/my`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "권한 조회 중 오류 발생";
    throw new Error(message);
  }
};