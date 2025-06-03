import { useDispatch, useSelector } from "react-redux";
import {
  setLoading,
  setError,
  setOtpSent,
  setPhoneNumber,
} from "../../../store/authSlice";
import { api, endpoints } from "../../../api/config";

const PhoneForm = () => {
  const dispatch = useDispatch();
  const { loading, phoneNumber } = useSelector((state) => state.auth);

  const handlePhoneChange = (e) => {
    console.log(e.target.value);
    const value = e.target.value;
    // Allow empty value for backspace/delete
    if (value === "") {
      dispatch(setPhoneNumber(""));
      return;
    }
    // Only allow numbers and + symbol at the start
    const sanitizedValue = value.replace(/[^\d+]/g, "");
    // Ensure + is only at the start
    const finalValue = sanitizedValue.startsWith("+")
      ? "+" + sanitizedValue.slice(1).replace(/\+/g, "")
      : sanitizedValue.replace(/\+/g, "");

    if (finalValue.length <= 15) {
      dispatch(setPhoneNumber(finalValue));
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      dispatch(setError("Please enter a valid phone number"));
      return;
    }
    try {
      dispatch(setLoading(true));
      const response = await api.post(endpoints.auth.sendOtp, {
        phone: phoneNumber,
      });
      dispatch(setOtpSent(true));
      console.log("OTP:", response.data);
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "Failed to send OTP"));
    }
  };

  return (
    <div className="w-full flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg p-8 pt-2">
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div className="relative">
            <input
              type="tel"
              id="phone"
              value={phoneNumber || ""}
              onChange={handlePhoneChange}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-sm text-sm placeholder-transparent peer focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              placeholder="Phone Number"
              required
              inputMode="tel"
              autoComplete="tel"
            />
            <label
              htmlFor="phone"
              className="absolute left-3 -top-2.5 px-1 text-xs text-gray-600 bg-white transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2.5 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-gray-600"
            >
              Phone Number *
            </label>
            <p className="mt-1 text-xs text-gray-500">
              Enter your phone number
            </p>
          </div>
          <button
            type="submit"
            disabled={loading || !phoneNumber || phoneNumber.length < 10}
            className="w-full py-2.5 px-4 bg-primary text-white text-sm font-semibold rounded-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
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
                Sending OTP...
              </div>
            ) : (
              "Get OTP"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PhoneForm;
