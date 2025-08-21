import instance from "../../../lib/axios";

export const fetchMemberData = async ({page, latestFirst}) => {
    const params = {page, latestFirst}
    const res = await instance.get(`/platform/admin/member`, { params });
    return res.data;
}

export const fetchFilteredData = async ({page, keyword, latestFirst}) => {
    const params = {page, keyword, latestFirst}
    const res = await instance.get(`/platform/admin/member/filter`, { params });
    return res.data;
}