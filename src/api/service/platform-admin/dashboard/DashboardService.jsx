import instance from "../../../lib/axios";

export const getRevenue = async (activeTab) => {
    return instance.get(`/platform/dashboard/revenue`, {
        params: { period: activeTab }
    })
};

export const getUsage = async (activeTab) => {
    return instance.get(`/platform/dashboard/usage`, {
        params: {period: activeTab}
    })
};