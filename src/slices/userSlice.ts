import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Apis } from "../apis";

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  phone?: string;
  password?: string;
}

interface UserState {
  allUsers: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  allUsers: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (bd) => {
    // Admin - fetch all users
    bd.addCase(fetchAllUsers.fulfilled, (state, action) => {
      state.allUsers = action.payload;
    });
    // Admin - create user
    bd.addCase(createUserThunk.fulfilled, (state, action) => {
      state.allUsers.push(action.payload);
    });
    // Admin - update user
    bd.addCase(updateUserThunk.fulfilled, (state, action) => {
      const index = state.allUsers.findIndex((u) => u.id === action.payload.id);
      if (index !== -1) {
        state.allUsers[index] = action.payload;
      }
    });
    // Admin - delete user
    bd.addCase(deleteUserThunk.fulfilled, (state, action) => {
      state.allUsers = state.allUsers.filter((u) => u.id !== action.payload);
    });
  },
});

export const userReducer = userSlice.reducer;

// Admin - User Management Thunks
export const fetchAllUsers = createAsyncThunk(
  "user/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const result = await Apis.user.getAll();
      return result;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch users";
      return rejectWithValue(message);
    }
  }
);

export const createUserThunk = createAsyncThunk(
  "user/createUser",
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
      const result = await Apis.user.create(payload);
      return result;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create user";
      return rejectWithValue(message);
    }
  }
);

export const updateUserThunk = createAsyncThunk(
  "user/updateUser",
  async (payload: { id: string; data: Partial<User> }, { rejectWithValue }) => {
    try {
      const result = await Apis.user.update(payload.id, payload.data);
      return result;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update user";
      return rejectWithValue(message);
    }
  }
);

export const deleteUserThunk = createAsyncThunk(
  "user/deleteUser",
  async (id: string, { rejectWithValue }) => {
    try {
      await Apis.user.delete(id);
      return id;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete user";
      return rejectWithValue(message);
    }
  }
);
