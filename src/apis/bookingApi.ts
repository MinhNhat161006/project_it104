import axios from "axios";

export const bookingApi = {
  // GET /bookings?userId={id}
  getByUser: async (userId: string) => {
    const res = await axios.get(
      `${import.meta.env.VITE_SV_HOST}/bookings?userId=${userId}`
    );
    return res.data;
  },

  // GET all bookings
  getAll: async () => {
    const res = await axios.get(`${import.meta.env.VITE_SV_HOST}/bookings`);
    return res.data;
  },

  // GET all users
  getAllUsers: async () => {
    const res = await axios.get(`${import.meta.env.VITE_SV_HOST}/users`);
    return res.data;
  },

  // POST /bookings
  create: async (payload: {
    userId: string;
    courseId: string;
    bookingDate: string;
    bookingTime: string;
  }) => {
    const res = await axios.post(`${import.meta.env.VITE_SV_HOST}/bookings`, {
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
    const res = await axios.patch(
      `${import.meta.env.VITE_SV_HOST}/bookings/${id}`,
      data
    );
    return res.data;
  },

  // DELETE /bookings/:id
  delete: async (id: string) => {
    await axios.delete(`${import.meta.env.VITE_SV_HOST}/bookings/${id}`);
  },
};
