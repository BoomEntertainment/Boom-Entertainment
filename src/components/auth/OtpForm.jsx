import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setError,
  setOtpSent,
  setIsRegistered,
  setToken,
  setUser,
  setLoading,
  setOtpVerified,
} from "../../store/authSlice";
import { api, endpoints } from "../../api/config";
import OtpInput from "./OtpInput";

const OtpForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, phoneNumber } = useSelector((state) => state.auth);
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleOtpChange = (value) => {
    if (isVerifying) return;
    setOtp(value);
    if (value.length === 6) {
      handleVerifyOtp(value);
    }
  };

  const handleVerifyOtp = async (otpValue = otp) => {
    if (otpValue.length !== 6 || isVerifying) {
      return;
    }

    try {
      setIsVerifying(true);
      dispatch(setLoading(true));
      const response = await api.post(endpoints.auth.verifyOtp, {
        phone: phoneNumber,
        otp: otpValue,
      });

      dispatch(setOtpVerified(true));

      if (response.data.isRegistered) {
        localStorage.setItem("token", response.data.token);
        await handleLogin();
      } else {
        dispatch(setIsRegistered(false));
        dispatch(setOtpVerified(true));
      }
    } catch (error) {
      dispatch(
        setError(error.response?.data?.message || "Failed to verify OTP")
      );
      setOtp("");
    } finally {
      dispatch(setLoading(false));
      setIsVerifying(false);
    }
  };

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
      dispatch(setError(error.response?.data?.message || "Login failed"));
      dispatch(setIsRegistered(false));
      navigate("/register");
    }
  };

  return (
    <div className="w-full flex items-center justify-center">
      <div className="w-full max-w-md bg-transparent rounded-lg pt-2">
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-200 mb-2"
            >
              Phone Number
            </label>
            <div className="relative">
              <input
                type="tel"
                value={phoneNumber || ""}
                className="w-full px-3 py-2.5 bg-[#1c1c1c] border border-gray-700 rounded-lg text-sm text-gray-400 cursor-not-allowed"
                disabled
              />
              <button
                type="button"
                onClick={() => {
                  dispatch(setOtpSent(false));
                  setOtp("");
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-[#f1c40f] hover:text-blue-300 font-medium"
              >
                Change
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-200 mb-2"
            >
              Enter OTP
            </label>
            <OtpInput
              value={otp}
              onChange={handleOtpChange}
              numInputs={6}
              disabled={loading || isVerifying}
            />
            <p className="mt-1 text-xs text-gray-400">
              Enter the 6-digit code sent to your phone
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleVerifyOtp()}
            disabled={loading || isVerifying || otp.length !== 6}
            className="w-full py-2.5 px-4 bg-[#f1c40f] text-white text-sm font-semibold rounded-lg hover:bg-white hover:text-black focus:outline-none focus:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading || isVerifying ? (
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
              "Verify OTP"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OtpForm;
