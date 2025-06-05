import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,
  error: null,
  otpSent: false,
  phoneNumber: null,
  isRegistered: false,
  otpVerified: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setOtpSent: (state, action) => {
      state.otpSent = action.payload;
      state.phoneNumber = action.payload ? state.phoneNumber : null;
    },
    setPhoneNumber: (state, action) => {
      state.phoneNumber = action.payload;
    },
    setIsRegistered: (state, action) => {
      state.isRegistered = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    setToken: (state, action) => {
      state.token = action.payload;
      if (action.payload) {
        localStorage.setItem("token", action.payload);
      } else {
        localStorage.removeItem("token");
      }
    },
    setOtpVerified: (state, action) => {
      state.otpVerified = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.otpSent = false;
      state.phoneNumber = null;
      state.isRegistered = false;
      state.otpVerified = false;
      localStorage.removeItem("token");
    },
  },
});

export const {
  setLoading,
  setError,
  setOtpSent,
  setPhoneNumber,
  setIsRegistered,
  setUser,
  setToken,
  setOtpVerified,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
