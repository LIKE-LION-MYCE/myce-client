import instance from "../../../../lib/axios";

const EXPO_FEE_SETTING_PREFIX = '/settings/expo-fee';

const getExpoFeeList = async (page, name) => {
    let uri = page || name ? `${EXPO_FEE_SETTING_PREFIX}?page=${page}`: EXPO_FEE_SETTING_PREFIX;
    if(name) uri += `&position=${name}`;
    return await instance.get(uri);
}

const addExpoFee = async (data) => {
    console.log(data);
    return await instance.post(EXPO_FEE_SETTING_PREFIX, {...data});
}

const updateActivatuibExpoFee = async (id, isActive) => {
    return await instance.put(`${EXPO_FEE_SETTING_PREFIX}/${id}/activation`, {isActive});
}

export {
    getExpoFeeList,
    addExpoFee,
    updateActivatuibExpoFee
}