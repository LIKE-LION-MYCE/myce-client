import instance from "../../lib/axios";

export const validatePeriod = async ({displayStartDate, displayEndDate, adPositionId}) => {
  const params = {displayStartDate, displayEndDate, adPositionId};
  const res = await instance.get('/ads/check-available', { params });
  return res;
}

export const saveAdvertisement = async (adData) => {
  const response = await instance.post("/ads", adData);
  return response;
};
