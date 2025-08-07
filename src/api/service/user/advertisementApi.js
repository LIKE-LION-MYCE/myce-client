import instance from "../../lib/axios";

export const saveAdvertisement = async (adData) => {
  const response = await instance.post("/ads", adData);
  return response;
};
