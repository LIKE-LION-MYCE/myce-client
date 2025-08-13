import instance from "../../lib/axios";

export const saveExpo = async (expoData) => {
  const response = await instance.post("/expos", expoData);
  return response;
};

export const getCongestionData = async (expoId) => {
  const response = await instance.get(`/expos/${expoId}/congestion`);
  return response;
};

export const getExpos = async (filters) => {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await instance.get(`/expos?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching expos:", error);
    throw error;
  }
};
