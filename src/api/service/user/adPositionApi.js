import instance from "../../lib/axios";

export const getAdPositions = async () => {
  const response = await instance.get("/ad-positions/dropdown");
  return response.data;
};
