import { bookingApi } from "./bookingApi";
import { authApi } from "./authApi";
import { userApi } from "./userApi";
import { courseApi } from "./courseApi";

export const Apis = {
  auth: authApi,
  user: userApi,
  booking: bookingApi,
  course: courseApi,
};
