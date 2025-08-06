import instance from "../../lib/axios";

const signup = async ({name, loginId, email, password, birth, phone, gender}) => {
    return await instance.post(`/auth/signup`, 
        {name, loginId, email, password, birth, phone, gender});
}

const login = async(loginId, password) => {
    console.log('try login!!!! ' + loginId + ' ' + password);
    return await instance.post(`/auth/login`, {loginId, password}).then(res => {
        console.log(res);
        const accessToken = res.headers.authorization;
        console.log(`Receive accessToken: ${accessToken}`);

        localStorage.setItem('access_token', accessToken.split(" ")[1]);
        return res;
    });
}

export {signup, login};