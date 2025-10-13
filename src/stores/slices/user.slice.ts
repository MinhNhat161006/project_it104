import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    data: null,
    loading: false,
  },
  reducers: {},
});

export const userReducer = userSlice.reducer;

export const userAction = {
  ...userSlice.actions,
};
