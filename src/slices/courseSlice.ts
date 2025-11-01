import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Apis } from "../apis";

export interface Course {
  id: string;
  name: string;
  type: string;
  description: string;
  price: number;
  imageUrl: string;
}

interface CourseState {
  data: Course[];
  loading: boolean;
  error: string | null;
}

const initialState: CourseState = {
  data: [],
  loading: false,
  error: null,
};

// GET all courses
export const fetchAllCourses = createAsyncThunk(
  "course/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const result = await Apis.course.getAll();
      return result;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch courses";
      return rejectWithValue(message);
    }
  }
);

// POST new course
export const createCourse = createAsyncThunk(
  "course/create",
  async (payload: Omit<Course, "id">, { rejectWithValue }) => {
    try {
      const result = await Apis.course.create(payload);
      return result;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create course";
      return rejectWithValue(message);
    }
  }
);

// PATCH course
export const updateCourse = createAsyncThunk(
  "course/update",
  async (
    payload: { id: string; data: Partial<Course> },
    { rejectWithValue }
  ) => {
    try {
      const result = await Apis.course.update(payload.id, payload.data);
      return result;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update course";
      return rejectWithValue(message);
    }
  }
);

// DELETE course
export const deleteCourse = createAsyncThunk(
  "course/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await Apis.course.delete(id);
      return id;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete course";
      return rejectWithValue(message);
    }
  }
);

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {},
  extraReducers: (bd) => {
    bd
      // Fetch all courses
      .addCase(fetchAllCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllCourses.fulfilled, (state, action) => {
        state.loading = false;
        // Sort courses alphabe theo tên
        state.data = action.payload.sort((a: Course, b: Course) =>
          a.name.localeCompare(b.name)
        );
      })
      // Create course
      .addCase(createCourse.fulfilled, (state, action) => {
        state.data.push(action.payload);
        // sắp xếp sau khi thêm
        state.data.sort((a, b) => a.name.localeCompare(b.name));
      })
      // Update course
      .addCase(updateCourse.fulfilled, (state, action) => {
        const index = state.data.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) state.data[index] = action.payload;
        // Sắp xếp sau khi cập nhật
        state.data.sort((a, b) => a.name.localeCompare(b.name));
      })
      // Delete course
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.data = state.data.filter((c) => c.id !== action.payload);
      });
  },
});

export const courseReducer = courseSlice.reducer;
