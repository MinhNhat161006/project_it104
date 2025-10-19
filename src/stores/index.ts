import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { fetchUserDataThunk, userReducer } from "./slices/user.slice";

const RootReducer = combineReducers({
  user: userReducer,
});

export type Store = ReturnType<typeof RootReducer>;

export const myStore = configureStore({
  reducer: RootReducer,
});

myStore.dispatch(fetchUserDataThunk());

export type AppDispatch = typeof myStore.dispatch;
