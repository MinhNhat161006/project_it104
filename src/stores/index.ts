import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { fetchUserDataThunk, authReducer } from "../slices/authSlice";
import { userReducer } from "../slices/userSlice";
import { bookingReducer } from "../slices/bookingSlice";
import { courseReducer, fetchAllCourses } from "../slices/courseSlice";

const RootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  booking: bookingReducer,
  course: courseReducer,
});

export type Store = ReturnType<typeof RootReducer>;

export const myStore = configureStore({
  reducer: RootReducer,
});

myStore.dispatch(fetchUserDataThunk());
myStore.dispatch(fetchAllCourses());

export type AppDispatch = typeof myStore.dispatch;
