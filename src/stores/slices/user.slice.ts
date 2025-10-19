import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Apis } from "../../apis";

export interface User {
  id: string;
  displayName: string;
  email: string;
  role: string;
}

export interface InitUserState {
  data: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: InitUserState = {
  data: null,
  loading: false,
  error: null,
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (bd) => {
    bd.addCase(fetchUserDataThunk.pending, (state, action) => {
      state.loading = true;
    });
    bd.addCase(fetchUserDataThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    bd.addCase(fetchUserDataThunk.rejected, (state, action) => {
      state.loading = false;
    });
    //dang ky
    bd.addCase(signUpUserThunk.pending, (state) => {
      state.loading = true;
    });
    bd.addCase(signUpUserThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    bd.addCase(signUpUserThunk.rejected, (state) => {
      state.loading = false;
    });
    //dang nhap
    bd.addCase(signInUserThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    bd.addCase(signInUserThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    bd.addCase(signInUserThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const fetchUserDataThunk = createAsyncThunk(
  "user/fetchUserData",
  async () => {
    let result = await Apis.user.me(localStorage.getItem("token"));
    return result;
  }
);

export const userReducer = userSlice.reducer;

export const userAction = {
  ...userSlice.actions,
};

//dang ky
export const signUpUserThunk = createAsyncThunk(
  "user/signUpUser",
  async (
    payload: { displayName: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const result = await Apis.user.signUp(payload);
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || "Đăng ký thất bại");
    }
  }
);

// Hiển thị loading khi đang gửi form

// Lưu thông tin người dùng vào Redux để dùng ở các trang khác

// Hiển thị lỗi từ server (ví dụ: email đã tồn tại)

// Tự động đăng nhập và chuyển hướng

//dang nhap
export const signInUserThunk = createAsyncThunk(
  "user/signInUser",
  async (payload: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const token = await Apis.user.signIn(payload);
      localStorage.setItem("token", token);

      const user = await Apis.user.me(token);

      const currentUser = {
        id: user.id,
        displayName: user.displayName,
        email: user.email,
        role: user.isAdmin ? "admin" : "user",
      };

      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      localStorage.setItem("role", currentUser.role);

      return currentUser;
    } catch (error: any) {
      return rejectWithValue(error.message || "Đăng nhập thất bại");
    }
  }
);
