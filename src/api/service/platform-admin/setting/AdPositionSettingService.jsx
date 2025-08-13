import instance from "../../../lib/axios";

export const fetchList = async (page) => {
    return await instance.get(`/ad-positions`, {
        params: { page }
    });
}