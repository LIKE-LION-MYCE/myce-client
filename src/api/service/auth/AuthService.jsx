import instance from "../../lib/axios";

const AUTH_PREFIX = "/auth";

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

export {signup, login, reissue, setAccessTokenToStorage};