import instance from "../../../../lib/axios"

const AD_FEE_SETTING_PREFIX = '/settings/ad-fee';

const getAdFeeSettingList = async (page, position, name) => {
    let uri = page || position || name ? `${AD_FEE_SETTING_PREFIX}?page=${page}`: AD_FEE_SETTING_PREFIX;
    if(position) uri += `&position=${position}`;
    if(name) uri += `&name=${name}`;
    return await instance.get(uri);
}

const addAdFeeSetting = async ({positionId, name, feePerDay, isActive}) => {
    return await instance.post(AD_FEE_SETTING_PREFIX, 
        {positionId, name, feePerDay, isActive});
}

const updateAcitvationAdFee = async (id, isActive) => {
    return await instance.put(`${AD_FEE_SETTING_PREFIX}/${id}/activation`, {isActive});
}

export {
    getAdFeeSettingList,
    addAdFeeSetting,
    updateAcitvationAdFee
}