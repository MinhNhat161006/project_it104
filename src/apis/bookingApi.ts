import axios from "axios";

const BASE_URL = "http://localhost:3000";

export const bookingApi = {
  // GET /bookings?userId={id}
  getByUser: async (userId: string) => {
    const res = await axios.get(`${BASE_URL}/bookings?userId=${userId}`);
    return res.data;
  },

  // GET all bookings
  getAll: async () => {
    const res = await axios.get(`${BASE_URL}/bookings`);
    return res.data;
  },

  // GET all users
  getAllUsers: async () => {
    const res = await axios.get(`${BASE_URL}/users`);
    return res.data;
  },

  // POST /bookings
  create: async (payload: {
    userId: string;
    courseId: string;
    bookingDate: string;
    bookingTime: string;
  }) => {
    const res = await axios.post(`${BASE_URL}/bookings`, {
      ...payload,
      status: "pending",
    });
    return res.data;
  },

  // PATCH /bookings/:id
  update: async (
    id: string,
    data: Partial<{
      userId: string;
      courseId: string;
      bookingDate: string;
      bookingTime: string;
      status: string;
    }>
  ) => {
    const res = await axios.patch(`${BASE_URL}/bookings/${id}`, data);
    return res.data;
  },

  // DELETE /bookings/:id
  delete: async (id: string) => {
    await axios.delete(`${BASE_URL}/bookings/${id}`);
  },
};
