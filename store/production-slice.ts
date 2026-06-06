import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { DetailingService, LeaderboardEntry } from '../types';
import { BASE_URL } from '../constants/api';

interface DetailingServiceResponse {
  detailingServiceId: number;
  vehicle: { vin: string; make: string; model: string };
  detailer: { userName: string };
  createdAt: string;
}

interface ProductionState {
  detailingServices: DetailingService[];
  leaderboard: LeaderboardEntry[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ProductionState = {
  detailingServices: [],
  leaderboard: [],
  isLoading: false,
  error: null,
};

const toDetailingService = (d: DetailingServiceResponse): DetailingService => ({
  id: d.detailingServiceId,
  vin: d.vehicle.vin,
  make: d.vehicle.make,
  model: d.vehicle.model,
  detailerName: d.detailer.userName,
  createdAt: d.createdAt,
});

export const fetchDetailingServices = createAsyncThunk(
  'production/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/production`);
      return (response.data as DetailingServiceResponse[]).map(toDetailingService);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'Failed to fetch detailing services');
    }
  }
);

export const fetchLeaderboard = createAsyncThunk(
  'production/fetchLeaderboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/production/leaderboard`);
      return response.data.leaderboard as LeaderboardEntry[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'Failed to fetch leaderboard');
    }
  }
);

export const addDetailingService = createAsyncThunk(
  'production/add',
  async ({ vin, detailerId }: { vin: string; detailerId: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/production`, { vin, detailerId });
      return toDetailingService(response.data as DetailingServiceResponse);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'Failed to record detailing');
    }
  }
);

const productionSlice = createSlice({
  name: 'production',
  initialState,
  reducers: {
    resetDetailingServices(state) {
      state.detailingServices = [];
      state.leaderboard = [];
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDetailingServices.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchDetailingServices.fulfilled, (state, action) => { state.isLoading = false; state.detailingServices = action.payload; })
      .addCase(fetchDetailingServices.rejected, (state, action) => { state.isLoading = false; state.error = action.payload as string; })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => { state.leaderboard = action.payload; })
      .addCase(fetchLeaderboard.rejected, (state, action) => { state.error = action.payload as string; })
      .addCase(addDetailingService.fulfilled, (state, action) => { state.detailingServices.push(action.payload); })
      .addCase(addDetailingService.rejected, (state, action) => { state.error = action.payload as string; });
  },
});

export const { resetDetailingServices, clearError } = productionSlice.actions;
export default productionSlice.reducer;
