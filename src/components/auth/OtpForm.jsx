import { useEffect, useState, useCallback } from "react";
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
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const startResendTimer = useCallback(() => {
    setCanResend(false);
    setResendTimer(30);
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const cleanup = startResendTimer();
    return cleanup;
  }, [startResendTimer]);

  const handleResendOtp = async () => {
    if (!canResend || loading) return;

    try {
      dispatch(setLoading(true));
      const response = await api.post(endpoints.auth.sendOtp, {
        phone: phoneNumber,
      });
      dispatch(setError(null));
      startResendTimer();
      console.log("OTP resent:", response.data);
    } catch (error) {
      dispatch(
        setError(error.response?.data?.message || "Failed to resend OTP")
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

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
        navigate("/register");
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
              className="block text-sm font-medium text-white mb-2"
            >
              Phone Number
            </label>
            <div className="relative">
              <input
                type="tel"
                value={phoneNumber || ""}
                className="w-full px-3 py-2.5 bg-[#1c1c1c] border border-[#303030] rounded-lg text-sm text-gray-400 cursor-not-allowed"
                disabled
              />
              <button
                type="button"
                onClick={() => {
                  dispatch(setOtpSent(false));
                  setOtp("");
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-[#f1c40f] hover:text-[#f2c50f] font-medium"
              >
                Change
              </button>
            </div>
          </div>

          <div className="w-full flex items-center justify-end">
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={!canResend || loading}
              className={`text-sm font-medium transition-colors ${
                canResend
                  ? "text-[#f1c40f] hover:text-[#f2c50f]"
                  : "text-gray-500 cursor-not-allowed"
              }`}
            >
              {canResend ? (
                "Resend OTP"
              ) : (
                <span className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Resend in {resendTimer}s
                </span>
              )}
            </button>
          </div>

          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-white mb-2"
            >
              Enter OTP
            </label>
            <OtpInput
              value={otp}
              onChange={handleOtpChange}
              numInputs={6}
              disabled={loading || isVerifying}
            />
            <p className="mt-3 text-xs text-gray-400">
              Enter the 6-digit code sent to your phone
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleVerifyOtp()}
            disabled={loading || isVerifying || otp.length !== 6}
            className="w-full py-2.5 px-4 bg-[#f1c40f] text-black text-sm font-semibold rounded-lg hover:bg-[#f2c50f] focus:outline-none focus:ring-2 focus:ring-[#f1c40f] focus:ring-offset-2 focus:ring-offset-[#1a1a1a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading || isVerifying ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-black"
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
