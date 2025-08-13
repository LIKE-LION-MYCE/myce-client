import instance from "../../lib/axios";

const AUTH_PREFIX = "/auth";
const EAMIL_VERIFICATION_API_PREFIX = `${AUTH_PREFIX}/email-verification`;
const VERIFICATION_TYPE = {
    SINGUP : 'SIGNUP',
    FIND_ID : 'FIND_ID',
    FIND_PASSWORD : 'FIND_PASSWORD'
}

const signup = async ({name, loginId, email, password, birth, phone, gender}) => {
    return await instance.post(`${AUTH_PREFIX}/signup`, 
        {name, loginId, email, password, birth, phone, gender});
}

const login = async (loginType, loginId, password) => {
    return await instance.post(`${AUTH_PREFIX}/login`, {loginType, loginId, password}).then(res => {
        setAccessTokenToStorage(res);
        return res;
    });
}

const reissue = async () => {
    return instance.post(`${AUTH_PREFIX}/reissue`);
}

const setAccessTokenToStorage = (res) => {
    const accessToken = res.headers.authorization;
    localStorage.setItem('access_token', accessToken.split(" ")[1]);
}

const sendVerificatiionEmail = async (email) => {
    return await instance.post(`${EAMIL_VERIFICATION_API_PREFIX}/send`, 
        {verificationType : VERIFICATION_TYPE.SINGUP, email});
}

const verifyVerificationEmail = async (email, code) => {
    return await instance.post(`${EAMIL_VERIFICATION_API_PREFIX}/verify`, 
        {verificationType : VERIFICATION_TYPE.SINGUP, email, code});
}

const checkDuplicateLoginId = async (loginId) => {
    return await instance.get(`${AUTH_PREFIX}/check-duplicate?loginId=${loginId}`);
}

export {
    signup, 
    login, 
    reissue, 
    setAccessTokenToStorage,
    sendVerificatiionEmail,
    verifyVerificationEmail,
    checkDuplicateLoginId
};