import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Apis } from "../apis";

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  phone?: string;
}

export interface AuthState {
  data: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  data: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (bd) => {
    bd.addCase(fetchUserDataThunk.pending, (state) => {
      state.loading = true;
    });
    bd.addCase(fetchUserDataThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    bd.addCase(fetchUserDataThunk.rejected, (state) => {
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
    //dang xuat
    bd.addCase(logoutUserThunk.fulfilled, (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    });
  },
});

export const fetchUserDataThunk = createAsyncThunk(
  "auth/fetchUserData",
  async () => {
    const result = await Apis.auth.me(localStorage.getItem("token"));
    return result;
  }
);

export const authReducer = authSlice.reducer;

export const authAction = {
  ...authSlice.actions,
};

//dang ky
export const signUpUserThunk = createAsyncThunk(
  "auth/signUpUser",
  async (
    payload: {
      fullName: string;
      email: string;
      password: string;
      phone: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const result = await Apis.auth.signUp(payload);
      return result;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Đăng ký thất bại";
      return rejectWithValue(message);
    }
  }
);

//dang nhap
export const signInUserThunk = createAsyncThunk(
  "auth/signInUser",
  async (payload: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const token = await Apis.auth.signIn(payload);
      localStorage.setItem("token", token);

      const user = await Apis.auth.me(token);

      const currentUser = {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        phone: user.phone,
      };

      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      localStorage.setItem("role", currentUser.role);

      return currentUser;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Đăng nhập thất bại";
      return rejectWithValue(message);
    }
  }
);

//dang xuat
export const logoutUserThunk = createAsyncThunk("auth/logoutUser", async () => {
  localStorage.removeItem("token");
  localStorage.removeItem("currentUser");
  localStorage.removeItem("role");

  return null;
});
