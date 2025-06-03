import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setError,
  setOtpSent,
  setIsRegistered,
  setToken,
  setUser,
} from "../../../store/authSlice";
import { api, endpoints } from "../../../api/config";

const OtpForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { phoneNumber } = useSelector((state) => state.auth);
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await api.post(endpoints.auth.login, {
        phone: phoneNumber,
      });
      if (response.data.token) {
        dispatch(setToken(response.data.token));
        dispatch(setUser(response.data.data.user));
        navigate("/");
      }
    } catch (error) {
      console.log("Login failed:", error.response?.data);
      dispatch(setError(error.response?.data?.message || "Login failed"));
      // If login fails, show registration form
      dispatch(setIsRegistered(false));
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      dispatch(setError("Please enter a valid 6-digit OTP"));
      return;
    }
    try {
      setIsVerifying(true);
      const response = await api.post(endpoints.auth.verifyOtp, {
        phone: phoneNumber,
        otp,
      });

      console.log("OTP verification response:", response.data);

      // Handle the response based on isRegistered status
      if (response.data.isRegistered) {
        console.log("User is registered, proceeding with login");
        // If user is registered, proceed with login
        await handleLogin();
      } else {
        console.log("User is not registered, showing registration form");
        // If user is not registered, show registration form
        dispatch(setIsRegistered(true)); // Changed to true to show registration form
      }
    } catch (error) {
      console.log("OTP verification failed:", error.response?.data);
      dispatch(
        setError(error.response?.data?.message || "Failed to verify OTP")
      );
      // If verification fails, stay on OTP form
      dispatch(setIsRegistered(false));
    } finally {
      setIsVerifying(false);
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
  };

  return (
    <form onSubmit={handleVerifyOtp} className="space-y-6">
      <div className="relative">
        <input
          type="tel"
          value={phoneNumber}
          className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-500 cursor-not-allowed"
          disabled
        />
        <button
          type="button"
          onClick={() => dispatch(setOtpSent(false))}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-primary hover:text-blue-700 font-medium"
        >
          Change
        </button>
      </div>

      <div className="relative">
        <input
          type="text"
          id="otp"
          value={otp}
          onChange={handleOtpChange}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-center text-2xl tracking-widest placeholder-transparent peer focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          placeholder="Enter OTP"
          maxLength={6}
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="one-time-code"
          required
        />
        <label
          htmlFor="otp"
          className="absolute left-3 -top-2.5 px-1 text-xs text-gray-600 bg-white transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2.5 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-gray-600"
        >
          Enter OTP
        </label>
        <p className="mt-1 text-xs text-gray-500 text-center">
          Enter the 6-digit code sent to your phone
        </p>
      </div>

      <button
        type="submit"
        disabled={isVerifying || otp.length !== 6}
        className="w-full py-3 px-4 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isVerifying ? (
          <div className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Verifying...
          </div>
        ) : (
          "Verify"
        )}
      </button>
    </form>
  );
};

export default OtpForm;
