import axios from "axios";

const BASE_URL = "http://localhost:5013/api";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle CORS errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.message === "Network Error") {
      console.error(
        "Network Error - Please check if the backend server is running"
      );
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const endpoints = {
  auth: {
    sendOtp: "/auth/send-otp",
    verifyOtp: "/auth/verify-otp",
    register: "/auth/register",
    login: "/auth/login",
  },
  wallet: {
    getWallet: "/wallet",
    addMoney: "/wallet/add",
    withdraw: "/wallet/withdraw",
  },
};
