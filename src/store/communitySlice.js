import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api, endpoints } from "../api/config";

// Async thunks
export const fetchUserCommunities = createAsyncThunk(
  "community/fetchUserCommunities",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(endpoints.community.getUserCommunities);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchCommunityById = createAsyncThunk(
  "community/fetchCommunityById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(endpoints.community.getCommunity(id));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const toggleFollowCommunity = createAsyncThunk(
  "community/toggleFollow",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(endpoints.community.follow(id));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const becomeCreator = createAsyncThunk(
  "community/becomeCreator",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(endpoints.community.becomeCreator(id));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  userCommunities: {
    data: null,
    loading: false,
    error: null,
  },
  currentCommunity: {
    data: null,
    loading: false,
    error: null,
  },
  actionStatus: {
    loading: false,
    error: null,
    success: false,
    message: "",
  },
};

const communitySlice = createSlice({
  name: "community",
  initialState,
  reducers: {
    clearActionStatus: (state) => {
      state.actionStatus = {
        loading: false,
        error: null,
        success: false,
        message: "",
      };
    },
  },
  extraReducers: (builder) => {
    // fetchUserCommunities
    builder
      .addCase(fetchUserCommunities.pending, (state) => {
        state.userCommunities.loading = true;
        state.userCommunities.error = null;
      })
      .addCase(fetchUserCommunities.fulfilled, (state, action) => {
        state.userCommunities.loading = false;
        state.userCommunities.data = action.payload.data;
      })
      .addCase(fetchUserCommunities.rejected, (state, action) => {
        state.userCommunities.loading = false;
        state.userCommunities.error = action.payload;
      })

      // fetchCommunityById
      .addCase(fetchCommunityById.pending, (state) => {
        state.currentCommunity.loading = true;
        state.currentCommunity.error = null;
      })
      .addCase(fetchCommunityById.fulfilled, (state, action) => {
        state.currentCommunity.loading = false;
        state.currentCommunity.data = action.payload.data;
      })
      .addCase(fetchCommunityById.rejected, (state, action) => {
        state.currentCommunity.loading = false;
        state.currentCommunity.error = action.payload;
      })

      // toggleFollowCommunity
      .addCase(toggleFollowCommunity.pending, (state) => {
        state.actionStatus.loading = true;
        state.actionStatus.error = null;
      })
      .addCase(toggleFollowCommunity.fulfilled, (state, action) => {
        state.actionStatus.loading = false;
        state.actionStatus.success = true;
        state.actionStatus.message = action.payload.message;

        // Update following status and follower count
        const wasFollowing = state.currentCommunity.data.isFollowing;
        state.currentCommunity.data.isFollowing = !wasFollowing;
        state.currentCommunity.data.followersCount += wasFollowing ? -1 : 1;

        // Update userCommunities if available
        if (state.userCommunities.data) {
          const { following } = state.userCommunities.data;
          if (wasFollowing) {
            // Remove from following list
            state.userCommunities.data.following = following.filter(
              (c) => c._id !== state.currentCommunity.data._id
            );
            state.userCommunities.data.statistics.followingCount -= 1;
          } else {
            // Add to following list
            const communityData = {
              ...state.currentCommunity.data,
              joinedAt: new Date().toISOString(),
            };
            state.userCommunities.data.following.push(communityData);
            state.userCommunities.data.statistics.followingCount += 1;
          }
        }
      })
      .addCase(toggleFollowCommunity.rejected, (state, action) => {
        state.actionStatus.loading = false;
        state.actionStatus.error = action.payload;
      })

      // becomeCreator
      .addCase(becomeCreator.pending, (state) => {
        state.actionStatus.loading = true;
        state.actionStatus.error = null;
      })
      .addCase(becomeCreator.fulfilled, (state, action) => {
        state.actionStatus.loading = false;
        state.actionStatus.success = true;
        state.actionStatus.message = action.payload.message;

        // Update creator status and counts
        state.currentCommunity.data.isCreator = true;
        state.currentCommunity.data.creatorsCount += 1;

        // Update userCommunities if available
        if (state.userCommunities.data) {
          const { creator } = state.userCommunities.data;
          // Add to creator list
          const communityData = {
            ...state.currentCommunity.data,
            joinedAt: new Date().toISOString(),
          };
          state.userCommunities.data.creator.push(communityData);
          state.userCommunities.data.statistics.creatorCount += 1;
        }
      })
      .addCase(becomeCreator.rejected, (state, action) => {
        state.actionStatus.loading = false;
        state.actionStatus.error = action.payload;
      });
  },
});

export const { clearActionStatus } = communitySlice.actions;
export default communitySlice.reducer;
