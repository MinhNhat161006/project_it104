import axios from "axios";

export const courseApi = {
  // GET all courses
  getAll: async () => {
    const res = await axios.get(`${import.meta.env.VITE_SV_HOST}/courses`);
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
    const res = await axios.post(
      `${import.meta.env.VITE_SV_HOST}/courses`,
      payload
    );
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
    const res = await axios.patch(
      `${import.meta.env.VITE_SV_HOST}/courses/${id}`,
      data
    );
    return res.data;
  },

  // DELETE course
  delete: async (id: string) => {
    await axios.delete(`${import.meta.env.VITE_SV_HOST}/courses/${id}`);
  },
};
