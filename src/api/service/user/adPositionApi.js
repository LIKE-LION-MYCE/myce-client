import instance from "../../lib/axios";

export const getAdPositions = async () => {
  const response = await instance.get("/ad-positions/dropdown");
  return response.data;
};

export const getAdPositionsWithDimensions = async () => {
  const response = await instance.get("/ad-positions/dropdown-with-dimensions");
  return response.data;
};
