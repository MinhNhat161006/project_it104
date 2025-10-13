import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./slices/user.slice";

const RootReducer = combineReducers({
  user: userReducer,
});

export type Store = ReturnType<typeof RootReducer>;

export const myStore = configureStore({
  reducer: RootReducer,
});
