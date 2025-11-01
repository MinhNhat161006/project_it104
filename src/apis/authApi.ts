import axios from "axios";
import * as jose from "jose";

export interface SignDTO {
  fullName: string;
  email: string;
  password: string;
  phone: string;
}

export interface SignInDTO {
  email: string;
  password: string;
}

export const authApi = {
  signUp: async (data: SignDTO) => {
    const result = await axios.get(
      `${import.meta.env.VITE_SV_HOST}/users?email=` + data.email
    );
    if (result.data.length > 0) {
      throw {
        message: "Email đã tồn tại",
      };
    }
    const newUserRes = await axios
      .post(`${import.meta.env.VITE_SV_HOST}/users`, {
        ...data,
        role: "user",
      })
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        throw {
          message: "Lỗi đăng ký",
        };
      });
    return newUserRes;
  },
  signIn: async (data: SignInDTO) => {
    const findUserByEmailRes = await axios.get(
      `${import.meta.env.VITE_SV_HOST}/users?email=` + data.email
    );

    console.log("findUserByEmailRes", findUserByEmailRes);

    if (findUserByEmailRes.data.length <= 0) {
      throw {
        message: "Không tìm thấy người dùng",
      };
    }
    if (data.password != findUserByEmailRes.data[0].password) {
      throw {
        message: "Mật khẩu không đúng",
      };
    }

    // Nguoi dung dang nhap dung thong tin => tao ra token
    const token = await createToken(findUserByEmailRes.data[0].id);
    return token;
  },
  me: async (token: string | null) => {
    if (!token) {
      throw {
        message: "Token không tồn tại!",
      };
    }

    const tokenData = await decodeToken(token);
    if (!tokenData) {
      throw {
        message: "Token không chính xác!",
      };
    }

    const { userId } = tokenData;

    const getUserByIdRes = await axios.get(
      `${import.meta.env.VITE_SV_HOST}/users/${userId}`
    );

    if (!getUserByIdRes) {
      throw {
        message: "Lỗi lấy dữ liệu",
      };
    }

    return getUserByIdRes.data;
  },
};

async function createToken(userId: string) {
  const secret = new TextEncoder().encode(import.meta.env.VITE_JWT_TOKEN);
  const alg = "HS256";

  const token = await new jose.SignJWT({ userId })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(secret);
  return token;
}

//decode token
async function decodeToken(token: string) {
  try {
    const secret = new TextEncoder().encode(import.meta.env.VITE_JWT_TOKEN);

    const { payload } = await jose.jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });

    return payload;
  } catch (error) {
    console.error("Token không hợp lệ", error);
    return null;
  }
}
