import instance from "../../../lib/axios";

export const fetchList = async (page) => {
    return await instance.get(`/ad-positions`, {
        params: { page }
    });
}

export const fetchDetail = async (bannerId) => {
    return await instance.get(`/ad-positions/${bannerId}`);
}

export const submitUpdate = async ({bannerId, formData}) => {
    return await instance.put(`/ad-positions/${bannerId}/update`, formData);
}