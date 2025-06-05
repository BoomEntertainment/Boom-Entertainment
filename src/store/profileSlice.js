import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api, endpoints } from "../api/config";

// Async thunks
export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (username, { rejectWithValue }) => {
    try {
      const response = await api.get(endpoints.profile.getProfile(username));
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile"
      );
    }
  }
);

export const fetchMe = createAsyncThunk(
  "profile/fetchMe",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(endpoints.auth.me);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user data"
      );
    }
  }
);

const initialState = {
  currentProfile: null,
  me: null,
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.currentProfile = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchProfile
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProfile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle fetchMe
      .addCase(fetchMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.loading = false;
        state.me = action.payload;
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
