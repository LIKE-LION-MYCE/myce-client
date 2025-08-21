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
    // Filter out undefined, null values and 'all' status from filters
    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(
        ([key, value]) => value !== undefined && value !== null && 
        !(key === 'status' && value === 'all')
      )
    );

    const queryParams = new URLSearchParams(cleanedFilters).toString();
    const response = await instance.get(`/expos?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching expos:", error);
    throw error;
  }
};

export const getPendingPublishExpos = async () => {
  try {
    const response = await instance.get("/expos?status=PENDING_PUBLISH");
    return response.data;
  } catch (error) {
    console.error("Error fetching pending publish expos:", error);
    throw error;
  }
};
