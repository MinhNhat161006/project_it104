import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { fetchUserDataThunk, userReducer } from "./slices/user.slice";
import { bookingReducer } from "./slices/booking.slice";

const RootReducer = combineReducers({
  user: userReducer,
  booking: bookingReducer,
});

export type Store = ReturnType<typeof RootReducer>;

export const myStore = configureStore({
  reducer: RootReducer,
});

myStore.dispatch(fetchUserDataThunk());

export type AppDispatch = typeof myStore.dispatch;
