import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api, endpoints } from "../api/config";

export const fetchWalletAndHistory = createAsyncThunk(
  "wallet/fetchWalletAndHistory",
  async ({ page = 1, limit = 20 } = {}) => {
    const response = await api.get(
      `${endpoints.wallet.getWallet}?page=${page}&limit=${limit}`
    );

    return response.data.data;
  }
);

export const addMoney = createAsyncThunk(
  "wallet/addMoney",
  async ({ amount, transactionType = "recharge" }) => {
    const response = await api.post(endpoints.wallet.addMoney, {
      amount,
      transactionType,
    });
    return response.data.data;
  }
);

export const withdrawMoney = createAsyncThunk(
  "wallet/withdrawMoney",
  async ({ amount, bankDetails }) => {
    const response = await api.post(endpoints.wallet.withdraw, {
      amount,
      bankDetails,
    });
    return response.data.data;
  }
);

const initialState = {
  balance: 0,
  history: [],
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  },
  loading: false,
  error: null,
  filters: {
    type: "all",
    transactionType: "all",
    status: "all",
  },
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchWalletAndHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWalletAndHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload.wallet.balance;
        state.history = action.payload.history;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchWalletAndHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(addMoney.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMoney.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload.wallet.balance;
        state.history = [action.payload.history, ...state.history];
      })
      .addCase(addMoney.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(withdrawMoney.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(withdrawMoney.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload.remainingBalance;
        state.history = [action.payload.withdrawal, ...state.history];
      })
      .addCase(withdrawMoney.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setFilters, clearFilters } = walletSlice.actions;
export default walletSlice.reducer;
