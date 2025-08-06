import instance from "../../lib/axios";

export const saveExpo = async (expoData) => {
  const response = await instance.post("/expos", expoData);
  return response;
};
