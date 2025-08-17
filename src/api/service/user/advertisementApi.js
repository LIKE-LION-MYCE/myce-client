import instance from "../../lib/axios";

export const validatePeriod = async ({
  displayStartDate,
  displayEndDate,
  adPositionId,
}) => {
  const params = { displayStartDate, displayEndDate, adPositionId };
  const res = await instance.get("/ads/check-available", { params });
  return res;
};

export const saveAdvertisement = async (adData) => {
  const response = await instance.post("/ads", adData);
  return response;
};

export const updateAdStatus = async (adId, advertisementStatus) => {
  const { data } = await instance.patch(`/platform/ads/${adId}/status`, {
    advertisementStatus,
  });
  return data;
};
