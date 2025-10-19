import { message } from "antd";
import Password from "antd/es/input/Password";
import axios from "axios";
import * as jose from 'jose'
import { jwtDecode } from "jwt-decode";



export interface SignDTO {
    displayName: string;
    email: string;
    password: string;
}

export interface SignInDTO {
    email: string;
    password: string;
}

export const UserApi = {
    signUp: async (data: SignDTO) => {
        let result = await axios.get(`${import.meta.env.VITE_SV_HOST}/user?email=` + data.email)
        if (result.data.length > 0) {
            throw ({
                message: "email da ton tai"
            })
        }
        let newUserRes = await axios.post(`${import.meta.env.VITE_SV_HOST}/user`, {
            ...data,
            isAdmin: "false"
        }).then(res => {
            return res.data
        }).catch(err => {
            throw ({
                message: "loi dang ky"
            })

        })
        return newUserRes
    },
    signIn: async (data: SignInDTO) => {
        let findUserByEmailRes = await axios.get(`${import.meta.env.VITE_SV_HOST}/user?email=` + data.email)

        console.log("findUserByEmailRes", findUserByEmailRes);

        if (findUserByEmailRes.data.length <= 0) {
            throw ({
                message: "Khong tim thay nguoi dung",
            })
        }
        if (data.password != findUserByEmailRes.data[0].password) {
            throw ({
                message: "Mat khau khong dung",
            })
        }

        // Nguoi dung dang nhap dung thong tin => tao ra token
        let token = await createToken(findUserByEmailRes.data[0].id)
        return token
    },
    me: async (token: string) => {
        let tokenData = await decodeToken(token)
        if (!tokenData) {
            throw ({
                message: "Token khong chinh xac!"
            })
        }

        let { userId } = tokenData;

        let getUserByIdRes = await axios.get(`${import.meta.env.VITE_SV_HOST}/user/${userId}`)

        if (!getUserByIdRes) {
            throw ({
                message: "loi lay du lieu"
            })
        }

        return getUserByIdRes.data


    }
}

async function createToken(userId: string) {
    const secret = new TextEncoder().encode(import.meta.env.VITE_JWT_TOKEN);
    const alg = "HS256";

    const token = await new jose.SignJWT({ userId })
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setExpirationTime('2h')
        .sign(secret);
    return token
}

//decode token
async function decodeToken(token: string) {
    try {
        const secret = new TextEncoder().encode(import.meta.env.VITE_JWT_TOKEN)

        const { payload } = await jose.jwtVerify(token, secret, {
            algorithms: ['HS256'],
        })

        return payload
    } catch (error) {
        console.error("Token khong hop le", error)
        return null
    }
}