import instance from "../../../lib/axios";

export const getRevenue = async (activeTab) => {
    return instance.get(`/dashboard/revenue`, {
        params: { period: activeTab }
    })
};