import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Apis } from "../apis";

export interface Booking {
  id: string;
  userId: string;
  courseId: string;
  bookingDate: string;
  bookingTime: string;
  status: string;
}

export interface BookingWithUser extends Booking {
  userName?: string;
  userEmail?: string;
}

export interface BookingStats {
  [key: string]: number;
}

interface BookingState {
  data: Booking[];
  allBookings: BookingWithUser[];
  stats: BookingStats;
  loading: boolean;
  error: string | null;
}

const initialState: BookingState = {
  data: [],
  allBookings: [],
  stats: {},
  loading: false,
  error: null,
};

//  GET bookings bằng userId
export const fetchBookingsByUser = createAsyncThunk(
  "booking/fetchByUser",
  async (userId: string, { rejectWithValue }) => {
    try {
      const result = await Apis.booking.getByUser(userId);
      return result;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch bookings";
      return rejectWithValue(message);
    }
  }
);

//  GET tất cả bookings với thông tin user : admin xem toàn bộ lịch đặt, lọc...
export const fetchAllBookings = createAsyncThunk(
  "booking/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      //xử lí 2 api cùng lúc xong sẽ trả về 2 list là booking và user cùng lúc và ghép lại
      const [bookings, users] = await Promise.all([
        Apis.booking.getAll(),
        Apis.booking.getAllUsers(),
      ]);

      // Map bookings với thông tin user
      const bookingsWithUser: BookingWithUser[] = bookings.map(
        (booking: Booking) => {
          const user = users.find(
            (u: { id: string; fullName?: string; email?: string }) =>
              u.id === booking.userId
          );
          return {
            ...booking,
            userName: user?.fullName || "N/A",
            userEmail: user?.email || "N/A",
          };
        }
      );

      return bookingsWithUser;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch all bookings";
      return rejectWithValue(message);
    }
  }
);

// tính stats
export const calculateStats = createAsyncThunk(
  "booking/calculateStats",
  async (_, { rejectWithValue }) => {
    try {
      const bookings = await Apis.booking.getAll();
      const stats: BookingStats = {};

      // Tự động đếm lượt đặt chỗ cho từng loại khóa học
      bookings.forEach((booking: Booking) => {
        const courseType = booking.courseId?.toLowerCase();
        if (courseType) {
          stats[courseType] = (stats[courseType] || 0) + 1;
        }
      });

      return stats;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to calculate stats";
      return rejectWithValue(message);
    }
  }
);

// POST new booking
export const createBooking = createAsyncThunk(
  "booking/create",
  async (payload: Omit<Booking, "id" | "status">, { rejectWithValue }) => {
    try {
      const result = await Apis.booking.create(payload);
      return result;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create booking";
      return rejectWithValue(message);
    }
  }
);

//  PATCH booking
export const updateBooking = createAsyncThunk(
  "booking/update",
  async (
    payload: { id: string; data: Partial<Booking> },
    { rejectWithValue }
  ) => {
    try {
      const result = await Apis.booking.update(payload.id, payload.data);
      return result;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update booking";
      return rejectWithValue(message);
    }
  }
);

//  DELETE booking
export const deleteBooking = createAsyncThunk(
  "booking/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await Apis.booking.delete(id);
      return id;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete booking";
      return rejectWithValue(message);
    }
  }
);

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch bằng user
      .addCase(fetchBookingsByUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBookingsByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      // Fetch tất cả bookings
      .addCase(fetchAllBookings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.allBookings = action.payload;
      })
      // tính stats
      .addCase(calculateStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(calculateStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      // tạo booking
      .addCase(createBooking.fulfilled, (state, action) => {
        state.data.push(action.payload);
        state.allBookings.push(action.payload as BookingWithUser);
      })
      // cập nhật booking: .fulfilled → tìm booking theo `id` và cập nhật trong cả `data` và `allBookings`
      .addCase(updateBooking.fulfilled, (state, action) => {
        const index = state.data.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) state.data[index] = action.payload;

        const allIndex = state.allBookings.findIndex(
          (b) => b.id === action.payload.id
        );
        if (allIndex !== -1)
          state.allBookings[allIndex] = {
            ...state.allBookings[allIndex],
            ...action.payload,
          };
      })
      // delete booking
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.data = state.data.filter((b) => b.id !== action.payload);
        state.allBookings = state.allBookings.filter(
          (b) => b.id !== action.payload
        );
      });
  },
});

export const bookingReducer = bookingSlice.reducer;
