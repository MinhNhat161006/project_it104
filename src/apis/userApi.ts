import axios from "axios";
import type { SignDTO } from "./authApi";

export const userApi = {
  // Admin APIs for user management
  getAll: async () => {
    const res = await axios.get(`${import.meta.env.VITE_SV_HOST}/users`);
    return res.data;
  },

  create: async (payload: SignDTO) => {
    const res = await axios.post(`${import.meta.env.VITE_SV_HOST}/users`, {
      ...payload,
      role: "user",
    });
    return res.data;
  },

  update: async (id: string, data: Partial<SignDTO & { role: string }>) => {
    const res = await axios.patch(
      `${import.meta.env.VITE_SV_HOST}/users/${id}`,
      data
    );
    return res.data;
  },

  delete: async (id: string) => {
    await axios.delete(`${import.meta.env.VITE_SV_HOST}/users/${id}`);
  },
};
