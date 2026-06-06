import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Vehicle } from '../types';
import { BASE_URL } from '../constants/api';
import type { RootState } from './index';

interface FleetState {
  vehicles: Vehicle[];
  selectedVehicles: number[];
  isLoading: boolean;
  error: string | null;
}

const initialState: FleetState = {
  vehicles: [],
  selectedVehicles: [],
  isLoading: false,
  error: null,
};

const authHeader = (token: string | null) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const fetchVehicles = createAsyncThunk(
  'fleet/fetchVehicles',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState() as RootState;
      const response = await axios.get(`${BASE_URL}/api/fleet`, authHeader(user.token));
      return response.data as Vehicle[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'Failed to fetch vehicles');
    }
  }
);

export const addVehicle = createAsyncThunk(
  'fleet/addVehicle',
  async (vehicle: Omit<Vehicle, 'vehicleId' | 'isRented'>, { getState, rejectWithValue }) => {
    try {
      const { user } = getState() as RootState;
      const response = await axios.post(`${BASE_URL}/api/fleet`, vehicle, authHeader(user.token));
      return response.data.vehicle as Vehicle;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'Failed to add vehicle');
    }
  }
);

export const updateVehicle = createAsyncThunk(
  'fleet/updateVehicle',
  async (vehicle: Vehicle, { getState, rejectWithValue }) => {
    try {
      const { user } = getState() as RootState;
      const response = await axios.put(
        `${BASE_URL}/api/fleet/${vehicle.vehicleId}`,
        vehicle,
        authHeader(user.token)
      );
      return response.data.vehicle as Vehicle;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'Failed to update vehicle');
    }
  }
);

export const deleteVehicle = createAsyncThunk(
  'fleet/deleteVehicle',
  async (vehicleId: number, { getState, rejectWithValue }) => {
    try {
      const { user } = getState() as RootState;
      await axios.delete(`${BASE_URL}/api/fleet/${vehicleId}`, authHeader(user.token));
      return vehicleId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'Failed to delete vehicle');
    }
  }
);

const fleetSlice = createSlice({
  name: 'fleet',
  initialState,
  reducers: {
    resetVehicles(state) {
      state.vehicles = [];
    },
    setSelectedVehicleById(state, action: PayloadAction<number[]>) {
      state.selectedVehicles = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVehicles.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchVehicles.fulfilled, (state, action) => { state.isLoading = false; state.vehicles = action.payload; })
      .addCase(fetchVehicles.rejected, (state, action) => { state.isLoading = false; state.error = action.payload as string; })
      .addCase(addVehicle.fulfilled, (state, action) => { state.vehicles.push(action.payload); })
      .addCase(addVehicle.rejected, (state, action) => { state.error = action.payload as string; })
      .addCase(updateVehicle.fulfilled, (state, action) => {
        const idx = state.vehicles.findIndex(v => v.vehicleId === action.payload.vehicleId);
        if (idx !== -1) state.vehicles[idx] = action.payload;
      })
      .addCase(updateVehicle.rejected, (state, action) => { state.error = action.payload as string; })
      .addCase(deleteVehicle.fulfilled, (state, action) => {
        state.vehicles = state.vehicles.filter(v => v.vehicleId !== action.payload);
      })
      .addCase(deleteVehicle.rejected, (state, action) => { state.error = action.payload as string; });
  },
});

export const { resetVehicles, setSelectedVehicleById, clearError } = fleetSlice.actions;
export default fleetSlice.reducer;
