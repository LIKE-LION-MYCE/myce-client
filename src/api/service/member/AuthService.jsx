import instance from "../../lib/axios";

const signup = async ({name, loginId, email, password, birth, phone, gender}) => {
    return await instance.post(`/auth/signup`, 
        {name, loginId, email, password, birth, phone, gender});
}

export {signup};