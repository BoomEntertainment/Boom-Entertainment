import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { api, endpoints } from "../api/config";
import {
  setLoading,
  setError,
  setOtpSent,
  setPhoneNumber,
  setIsRegistered,
  setToken,
  setUser,
} from "../store/authSlice";
import PhoneForm from "../components/auth/PhoneForm";
import OtpForm from "../components/auth/OtpForm";

const Auth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, otpSent, phoneNumber, isRegistered, otpVerified } =
    useSelector((state) => state.auth);
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    dateOfBirth: "",
    gender: "",
    preferences: [],
    videoLanguage: "",
    profilePhoto: null,
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [focusedField, setFocusedField] = useState({
    name: false,
    username: false,
    dateOfBirth: false,
    preference: false,
    videoLanguage: false,
  });

  const [preferenceInput, setPreferenceInput] = useState("");
  const [showPreferenceSuggestions, setShowPreferenceSuggestions] =
    useState(false);

  const languages = [
    "English",
    "Telugu",
    "Hindi",
    "Tamil",
    "Kannada",
    "Malayalam",
    "Bengali",
    "Marathi",
    "Gujarati",
    "Punjabi",
  ];

  const preferenceOptions = [
    "Comedy",
    "Horror",
    "Action",
    "Drama",
    "Romance",
    "Thriller",
    "Sci-Fi",
    "Fantasy",
    "Documentary",
    "Animation",
    "Crime",
    "Mystery",
    "Adventure",
    "Family",
    "Sports",
    "Music",
    "Biography",
    "History",
    "War",
    "Western",
  ];

  const filteredPreferences = preferenceOptions.filter(
    (pref) =>
      pref.toLowerCase().includes(preferenceInput.toLowerCase()) &&
      !formData.preferences.includes(pref)
  );

  const nameRef = useRef(null);
  const usernameRef = useRef(null);
  const dateOfBirthRef = useRef(null);
  const preferenceRef = useRef(null);
  const videoLanguageRef = useRef(null);
  const suggestionsRef = useRef(null);

  const handleSendOtp = async (phone) => {
    try {
      dispatch(setLoading(true));
      const response = await api.post(endpoints.auth.sendOtp, { phone });
      dispatch(setOtpSent(true));
      console.log("OTP:", response.data);
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "Failed to send OTP"));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setIsRegistering(true);
      const formDataObj = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          if (key === "preferences") {
            formDataObj.append(key, JSON.stringify(formData[key]));
          } else {
            formDataObj.append(key, formData[key]);
          }
        }
      });
      formDataObj.append("phone", phoneNumber);

      // Try to get location
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        formDataObj.append(
          "location",
          JSON.stringify({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        );
      } catch (error) {
        console.log("Location not available");
      }

      const response = await api.post(endpoints.auth.register, formDataObj, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      dispatch(setToken(response.data.token));
      dispatch(setUser(response.data.data.user));
      navigate("/");
    } catch (error) {
      dispatch(
        setError(error.response?.data?.message || "Registration failed")
      );
    } finally {
      setIsRegistering(false);
    }
  };

  const handlePhoneChange = (value) => {
    dispatch(setPhoneNumber(value));
    dispatch(setOtpSent(false));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profilePhoto: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field, value) => {
    if (field === "username") {
      // Remove spaces from username
      value = value.replace(/\s/g, "");
    }
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFocus = (field) => {
    setFocusedField((prev) => ({
      ...prev,
      [field]: true,
    }));
    if (field === "preference") {
      setShowPreferenceSuggestions(true);
    }
  };

  const handleBlur = (field) => {
    setFocusedField((prev) => ({
      ...prev,
      [field]: false,
    }));
  };

  const handlePreferenceInputChange = (e) => {
    setPreferenceInput(e.target.value);
    setShowPreferenceSuggestions(true);
  };

  const handlePreferenceSelect = (pref) => {
    if (!formData.preferences.includes(pref)) {
      setFormData((prev) => ({
        ...prev,
        preferences: [...prev.preferences, pref],
      }));
    }
    setPreferenceInput("");
    setShowPreferenceSuggestions(true); // Keep suggestions open for further selections
  };

  const handlePreferenceRemove = (prefToRemove) => {
    setFormData((prev) => ({
      ...prev,
      preferences: prev.preferences.filter((pref) => pref !== prefToRemove),
    }));
  };

  // Handle clicks outside suggestions to close dropdown
  const handleClickOutside = (event) => {
    if (
      suggestionsRef.current &&
      !suggestionsRef.current.contains(event.target) &&
      preferenceRef.current &&
      !preferenceRef.current.contains(event.target)
    ) {
      setShowPreferenceSuggestions(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const renderRegisterForm = () => (
    <div className="w-full flex items-center justify-center">
      <div className="w-full max-w-md bg-transparent rounded-lg py-4 px-2">
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {/* Full Name */}
            <div className="relative">
              <input
                ref={nameRef}
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                onFocus={() => handleFocus("name")}
                onBlur={() => handleBlur("name")}
                className={`w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 placeholder-transparent peer focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors ${
                  focusedField.name ? "border-blue-500" : ""
                }`}
                required
              />
              <label
                className={`absolute left-3 px-1 text-xs bg-gray-800 transition-all ${
                  focusedField.name || formData.name
                    ? "-top-2.5 text-xs text-blue-400"
                    : "top-2.5 text-sm text-gray-400"
                }`}
              >
                Full Name *
              </label>
            </div>

            {/* Username */}
            <div className="relative">
              <input
                ref={usernameRef}
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                onFocus={() => handleFocus("username")}
                onBlur={() => handleBlur("username")}
                className={`w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 placeholder-transparent peer focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors ${
                  focusedField.username ? "border-blue-500" : ""
                }`}
                required
              />
              <label
                className={`absolute left-3 px-1 text-xs bg-gray-800 transition-all ${
                  focusedField.username || formData.username
                    ? "-top-2.5 text-xs text-blue-400"
                    : "top-2.5 text-sm text-gray-400"
                }`}
              >
                Username *
              </label>
            </div>

            {/* Date of Birth and Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-2 my-1 gap-4">
              <div className="relative">
                <input
                  ref={dateOfBirthRef}
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    handleInputChange("dateOfBirth", e.target.value)
                  }
                  onFocus={() => handleFocus("dateOfBirth")}
                  onBlur={() => handleBlur("dateOfBirth")}
                  className={`w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 placeholder-transparent peer focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors ${
                    focusedField.dateOfBirth ? "border-blue-500" : ""
                  }`}
                  required
                />
                <label
                  className={`absolute left-3 -top-2.5 px-1 text-xs bg-gray-800 ${
                    focusedField.dateOfBirth ? "text-blue-400" : "text-gray-400"
                  }`}
                >
                  Date of Birth *
                </label>
              </div>
              <div className="relative">
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  onFocus={() => handleFocus("gender")}
                  onBlur={() => handleBlur("gender")}
                  className={`w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 peer focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors ${
                    focusedField.gender ? "border-blue-500" : ""
                  }`}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <label
                  className={`absolute left-3 -top-2.5 px-1 text-xs bg-gray-800 ${
                    focusedField.gender ? "text-blue-400" : "text-gray-400"
                  }`}
                >
                  Gender *
                </label>
              </div>
            </div>

            {/* Video Language */}
            <div className="relative mb-1">
              <select
                value={formData.videoLanguage}
                onChange={(e) =>
                  handleInputChange("videoLanguage", e.target.value)
                }
                onFocus={() => handleFocus("videoLanguage")}
                onBlur={() => handleBlur("videoLanguage")}
                className={`w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 peer focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors ${
                  focusedField.videoLanguage ? "border-blue-500" : ""
                }`}
              >
                <option value="">Select Preferred Language</option>
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
              <label
                className={`absolute left-3 -top-2.5 px-1 text-xs bg-gray-800 ${
                  focusedField.videoLanguage ? "text-blue-400" : "text-gray-400"
                }`}
              >
                Video Language
              </label>
            </div>

            {/* Preferences */}
            <div className="relative">
              <div className="relative">
                <input
                  ref={preferenceRef}
                  type="text"
                  value={preferenceInput}
                  onChange={handlePreferenceInputChange}
                  onFocus={() => handleFocus("preference")}
                  onBlur={() => handleBlur("preference")}
                  className={`w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 placeholder-transparent peer focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors ${
                    focusedField.preference ? "border-blue-500" : ""
                  }`}
                  placeholder="Add preferences"
                />
                <label
                  className={`absolute left-3 -top-2.5 px-1 text-xs bg-gray-800 ${
                    focusedField.preference ? "text-blue-400" : "text-gray-400"
                  }`}
                >
                  Preferences
                </label>
              </div>

              {/* Preference Suggestions */}
              {showPreferenceSuggestions && preferenceInput && (
                <div
                  ref={suggestionsRef}
                  className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto"
                >
                  {filteredPreferences.map((pref) => (
                    <div
                      key={pref}
                      className="px-3 py-2 text-sm text-gray-200 hover:bg-gray-700 cursor-pointer"
                      onClick={() => handlePreferenceSelect(pref)}
                    >
                      {pref}
                    </div>
                  ))}
                </div>
              )}

              {/* Selected Preferences */}
              {formData.preferences.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.preferences.map((pref) => (
                    <div
                      key={pref}
                      className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-700 text-white"
                    >
                      {pref}
                      <button
                        type="button"
                        onClick={() => handlePreferenceRemove(pref)}
                        className="ml-1.5 hover:text-red-200 focus:outline-none"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Profile Photo */}
            <div className="space-y-2">
              <label className="block text-xs text-gray-400">
                Profile Photo
              </label>
              <div className="relative group">
                <div
                  className={`w-[200px] aspect-square rounded-lg border-2 border-dashed transition-colors ${
                    previewUrl
                      ? "border-gray-700"
                      : "border-gray-700 group-hover:border-blue-500"
                  }`}
                >
                  {previewUrl ? (
                    <div className="relative w-full h-full">
                      <img
                        src={previewUrl}
                        alt="Profile preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewUrl(null);
                          setFormData((prev) => ({
                            ...prev,
                            profilePhoto: null,
                          }));
                        }}
                        className="absolute top-2 right-2 p-1 bg-gray-800 bg-opacity-50 rounded-full text-gray-200 hover:bg-opacity-70 transition-opacity"
                      >
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
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                      <svg
                        className="w-12 h-12 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span className="mt-2 text-sm text-gray-400">
                        Click to upload photo
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={isRegistering}
            className="w-full py-2.5 px-4 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isRegistering ? (
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
                Creating Account...
              </div>
            ) : (
              "Complete Registration"
            )}
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div
        className={`w-full ${
          !otpSent || (otpVerified && !isRegistered)
            ? "max-w-[32rem]"
            : "max-w-md"
        } bg-gray-800 rounded-md shadow-xl backdrop-blur-lg backdrop-filter`}
      >
        <div className="p-6 sm:p-8 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-100 mb-2">
              {!otpSent
                ? "Login / Register"
                : !otpVerified
                ? "Verify OTP"
                : !isRegistered
                ? "Create Account"
                : "Verify OTP"}
            </h2>
            <p className="text-gray-400">
              {!otpSent
                ? "Enter your phone number to get started"
                : !otpVerified
                ? "Enter the OTP sent to your phone"
                : !isRegistered
                ? "Fill in your details to complete registration"
                : "Enter the OTP sent to your phone"}
            </p>
          </div>
          {error && (
            <div
              className="bg-red-900/50 border-l-4 border-red-500 p-4 rounded-lg flex items-center space-x-3"
              role="alert"
            >
              <svg
                className="h-5 w-5 text-red-400 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-red-200 text-sm">{error}</span>
            </div>
          )}
          <div className="mt-6">
            {!otpSent ? (
              <PhoneForm
                phoneNumber={phoneNumber}
                loading={loading}
                onPhoneChange={handlePhoneChange}
                onSendOtp={handleSendOtp}
              />
            ) : !otpVerified ? (
              <OtpForm />
            ) : !isRegistered ? (
              renderRegisterForm()
            ) : (
              <OtpForm />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
