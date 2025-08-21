import instance from "../../lib/axios";

export const saveFavorite = async (expoId) => {
  const res = await instance.post(`/favorites/${expoId}`);
  return !!res.data?.isBookmark;
};

export const deleteFavorite = async (expoId) => {
  const res = await instance.delete(`/favorites/${expoId}`);
  return !!res.data?.isBookmark;
};
