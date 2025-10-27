// apis/booking.ts
import axios from 'axios'

const BASE_URL = 'http://localhost:3000/bookings'

export const bookingApi = {
    // GET /bookings?userId={id}
    getByUser: async (userId: string) => {
        const res = await axios.get(`${BASE_URL}?userId=${userId}`)
        return res.data
    },

    // POST /bookings
    create: async (payload: {
        userId: string
        courseId: string
        bookingDate: string
        bookingTime: string
    }) => {
        const res = await axios.post(BASE_URL, {
            ...payload,
            status: 'pending'
        })
        return res.data
    },

    // PATCH /bookings/:id
    update: async (id: string, data: Partial<any>) => {
        const res = await axios.patch(`${BASE_URL}/${id}`, data)
        return res.data
    },

    // DELETE /bookings/:id
    delete: async (id: string) => {
        await axios.delete(`${BASE_URL}/${id}`)
    }
}
