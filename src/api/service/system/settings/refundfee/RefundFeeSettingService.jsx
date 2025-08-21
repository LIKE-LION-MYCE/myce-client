import instance from "../../../../lib/axios";

const REFUND_FEE_SETTING_PREFIX = '/settings/refund-fee';

const getRefundFeeList = async (page, name) => {
    let uri = page || name ? `${REFUND_FEE_SETTING_PREFIX}?page=${page}` : REFUND_FEE_SETTING_PREFIX;
    if(name) uri += `&name=${name}`;

    return await instance.get(uri);
}

const addRefundFee = async (refundFeeSetting) => {
    return await instance.post(REFUND_FEE_SETTING_PREFIX, {...refundFeeSetting});
}

const updateRefundFeeSetting = async (id, refundFeeSetting) => {
    return await instance.put(`${REFUND_FEE_SETTING_PREFIX}/${id}`, {...refundFeeSetting});
}

const updateActivatuibRefundFee = async (id, isActive) => {
    return await instance.put(`${REFUND_FEE_SETTING_PREFIX}/${id}/activation`, {isActive});
}

export {
    getRefundFeeList,
    addRefundFee,
    updateRefundFeeSetting,
    updateActivatuibRefundFee
};