import axios from "../lib/axios";

export const registerExpo = async (expoData) => {
  const response = await axios.post("/api/expos", expoData);
  return response;
};
