import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RentalService, RentalServiceResponse } from '../types';
import { BASE_URL } from '../constants/api';

interface RentalState {
  rentalServices: RentalService[];
  selectedRentalService: RentalService | null;
  selectedRentalServiceById: number[] | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: RentalState = {
  rentalServices: [],
  selectedRentalService: null,
  selectedRentalServiceById: null,
  isLoading: false,
  error: null,
};

const toRentalService = (r: RentalServiceResponse): RentalService => ({
  id: r.rentalServiceId,
  contactName: r.customer.name,
  contactEmail: r.customer.email,
  contactNum: r.customer.phoneNum,
  reservationStart: r.reservationStart,
  reservationEnd: r.reservationEnd,
  make: r.vehicle.make,
  model: r.vehicle.model,
  vin: r.vehicle.vin,
  color: r.vehicle.color,
});

export const fetchRentalServices = createAsyncThunk(
  'rental/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/rental`);
      return (response.data as RentalServiceResponse[]).map(toRentalService);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'Failed to fetch rentals');
    }
  }
);

export const searchRentalService = createAsyncThunk(
  'rental/search',
  async (
    params: { rentalServiceId?: number; customerEmail?: string; customerPhoneNum?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/rental`, { params });
      const results = response.data as RentalServiceResponse[];
      return results.length > 0 ? toRentalService(results[0]) : null;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'Rental not found');
    }
  }
);

export const addRentalService = createAsyncThunk(
  'rental/add',
  async (
    payload: { vin: string; customerEmail: string; serviceAgentId: string; reservationStart: string; reservationEnd: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/rental`, {
        VIN: payload.vin,
        CustomerEmail: payload.customerEmail,
        ServiceAgentId: payload.serviceAgentId,
        ReservationStart: payload.reservationStart,
        ReservationEnd: payload.reservationEnd,
      });
      return toRentalService(response.data as RentalServiceResponse);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'Failed to create rental');
    }
  }
);

export const updateRentalService = createAsyncThunk(
  'rental/update',
  async (
    payload: { rentalServiceId: number; reservationStart: string; reservationEnd: string },
    { rejectWithValue }
  ) => {
    try {
      await axios.put(`${BASE_URL}/api/rental/${payload.rentalServiceId}`, payload);
      return payload;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'Failed to update rental');
    }
  }
);

export const deleteRentalService = createAsyncThunk(
  'rental/delete',
  async (rentalServiceId: number, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/api/rental/${rentalServiceId}`);
      return rentalServiceId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'Failed to delete rental');
    }
  }
);

const rentalSlice = createSlice({
  name: 'rental',
  initialState,
  reducers: {
    clearSelectedRentalService(state) {
      state.selectedRentalService = null;
    },
    resetRentalServices(state) {
      state.rentalServices = [];
    },
    setSelectedRentalService(state, action: PayloadAction<number[]>) {
      state.selectedRentalServiceById = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRentalServices.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchRentalServices.fulfilled, (state, action) => { state.isLoading = false; state.rentalServices = action.payload; })
      .addCase(fetchRentalServices.rejected, (state, action) => { state.isLoading = false; state.error = action.payload as string; })
      .addCase(searchRentalService.fulfilled, (state, action) => { state.selectedRentalService = action.payload; })
      .addCase(searchRentalService.rejected, (state, action) => { state.error = action.payload as string; })
      .addCase(addRentalService.fulfilled, (state, action) => { state.rentalServices.push(action.payload); })
      .addCase(addRentalService.rejected, (state, action) => { state.error = action.payload as string; })
      .addCase(updateRentalService.fulfilled, (state, action) => {
        const { rentalServiceId, reservationStart, reservationEnd } = action.payload;
        const rental = state.rentalServices.find(r => r.id === rentalServiceId);
        if (rental) {
          rental.reservationStart = reservationStart;
          rental.reservationEnd = reservationEnd;
        }
      })
      .addCase(updateRentalService.rejected, (state, action) => { state.error = action.payload as string; })
      .addCase(deleteRentalService.fulfilled, (state, action) => {
        state.rentalServices = state.rentalServices.filter(r => r.id !== action.payload);
      })
      .addCase(deleteRentalService.rejected, (state, action) => { state.error = action.payload as string; });
  },
});

export const { clearSelectedRentalService, resetRentalServices, setSelectedRentalService, clearError } = rentalSlice.actions;
export default rentalSlice.reducer;
