import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Apis } from "../../apis";

export interface Booking {
  id: string;
  userId: string;
  courseId: string;
  bookingDate: string;
  bookingTime: string;
  status: string;
}

interface BookingState {
  data: Booking[];
  loading: boolean;
  error: string | null;
}

const initialState: BookingState = {
  data: [],
  loading: false,
  error: null,
};

//  GET bookings by userId
export const fetchBookingsByUser = createAsyncThunk(
  "booking/fetchByUser",
  async (userId: string, { rejectWithValue }) => {
    try {
      const result = await Apis.booking.getByUser(userId);
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message);
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
    } catch (error: any) {
      return rejectWithValue(error.message);
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
    } catch (error: any) {
      return rejectWithValue(error.message);
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
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookingsByUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBookingsByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(updateBooking.fulfilled, (state, action) => {
        const index = state.data.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) state.data[index] = action.payload;
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.data = state.data.filter((b) => b.id !== action.payload);
      });
  },
});

export const bookingReducer = bookingSlice.reducer;
