import { useDispatch, useSelector } from "react-redux";
import {
  setLoading,
  setError,
  setOtpSent,
  setPhoneNumber,
} from "../../store/authSlice";
import { api, endpoints } from "../../api/config";
import CountryCode from "./CountryCode";
import { useState, useEffect } from "react";

const PhoneForm = () => {
  const dispatch = useDispatch();
  const { loading, phoneNumber: storedPhoneNumber } = useSelector(
    (state) => state.auth
  );
  const [localPhoneNumber, setLocalPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+91");

  // Initialize local phone number from stored phone number if it exists
  useEffect(() => {
    if (storedPhoneNumber) {
      const numberPart = storedPhoneNumber.replace(/^\+\d+/, "");
      setLocalPhoneNumber(numberPart);
      const codePart = storedPhoneNumber.match(/^\+\d+/)?.[0] || "+91";
      setCountryCode(codePart);
    }
  }, [storedPhoneNumber]);

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (value === "") {
      setLocalPhoneNumber("");
      return;
    }
    // Only allow numbers
    const sanitizedValue = value.replace(/\D/g, "");
    if (sanitizedValue.length <= 10) {
      setLocalPhoneNumber(sanitizedValue);
    }
  };

  const handleCountryCodeChange = (code) => {
    setCountryCode(code);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!localPhoneNumber || localPhoneNumber.length !== 10) {
      dispatch(setError("Please enter a valid 10-digit phone number"));
      return;
    }

    const fullPhoneNumber = countryCode + localPhoneNumber;
    try {
      dispatch(setLoading(true));
      const response = await api.post(endpoints.auth.sendOtp, {
        phone: fullPhoneNumber,
      });
      dispatch(setPhoneNumber(fullPhoneNumber));
      dispatch(setOtpSent(true));
      console.log("OTP:", response.data);
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "Failed to send OTP"));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="w-full flex items-center justify-center">
      <div className="w-full max-w-md bg-transparent rounded-lg pt-2">
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-200 mb-2"
            >
              Phone Number
            </label>
            <div className="flex">
              <CountryCode onCountryCodeChange={handleCountryCodeChange} />
              <input
                type="tel"
                id="phone"
                value={localPhoneNumber}
                onChange={handlePhoneChange}
                className="flex-1 px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-r-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors"
                placeholder="Enter phone number"
                required
                inputMode="numeric"
                autoComplete="tel"
                maxLength={10}
              />
            </div>
            <p className="mt-1 text-xs text-gray-400">
              We'll send you a verification code
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:border-gray-600 transition-colors"
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
