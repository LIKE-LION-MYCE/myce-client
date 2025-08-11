import instance from "../../lib/axios";

export const saveExpo = async (expoData) => {
  const response = await instance.post("/expos", expoData);
  return response;
};

export const getCongestionData = async (expoId) => {
  const response = await instance.get(`/expos/${expoId}/congestion`);
  return response;
};
