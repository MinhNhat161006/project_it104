import axios from "axios";

const BASE_URL = "http://localhost:3000";

export const courseApi = {
  // GET all courses
  getAll: async () => {
    const res = await axios.get(`${BASE_URL}/courses`);
    return res.data;
  },

  // POST new course
  create: async (payload: {
    name: string;
    type: string;
    description: string;
    price: number;
    imageUrl: string;
  }) => {
    const res = await axios.post(`${BASE_URL}/courses`, payload);
    return res.data;
  },

  // PATCH course
  update: async (
    id: string,
    data: Partial<{
      name: string;
      type: string;
      description: string;
      price: number;
      imageUrl: string;
    }>
  ) => {
    const res = await axios.patch(`${BASE_URL}/courses/${id}`, data);
    return res.data;
  },

  // DELETE course
  delete: async (id: string) => {
    await axios.delete(`${BASE_URL}/courses/${id}`);
  },
};
