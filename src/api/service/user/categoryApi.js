import instance from "../../lib/axios";

// 카테고리 전체 조회
export const getCategories = async () => {
  const response = await instance.get("/categories");
  return response.data;
};
