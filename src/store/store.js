import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import profileReducer from "./profileSlice";
import walletReducer from "./walletSlice";
import communityReducer from "./communitySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    wallet: walletReducer,
    community: communityReducer,
  },
});
