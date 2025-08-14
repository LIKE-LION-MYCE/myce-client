import instance from "../../../lib/axios";

export const fetchList = async (page) => {
    return await instance.get(`/ad-positions`, {
        params: { page }
    });
}
export const fetchDetail = async (bannerId) => {
    return await instance.get(`/ad-positions/${bannerId}`);
}

export const submitNew = async ({ formData }) => {
    return await instance.post(`/ad-positions/new`, formData);
}

export const submitUpdate = async ({ bannerId, formData }) => {
    return await instance.put(`/ad-positions/${bannerId}/update`, formData);
}

export const submitDelete = async ({bannerId}) => {
    return await instance.delete(`/ad-positions/${bannerId}/delete`);
}