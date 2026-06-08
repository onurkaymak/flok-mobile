import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { format } from "date-fns";

import type { RentalService, RentalServiceResponse } from "../../types";

interface RentalState {
  rentalServices: RentalService[];
  selectedRentalService: RentalService | null;
  selectedRentalServiceById: number[] | null;
}

const initialState: RentalState = {
  rentalServices: [],
  selectedRentalService: null,
  selectedRentalServiceById: null,
};

const rentalSlice = createSlice({
  name: "rental",
  initialState: initialState,
  reducers: {
    fetchSelectedRentalService(state, action: PayloadAction<RentalService>) {
      state.selectedRentalService = { ...action.payload };
    },
    clearSelectedRentalService(state) {
      state.selectedRentalService = null;
    },
    fetchRentalServiceList(state, action: PayloadAction<RentalServiceResponse[]>) {
      action.payload.forEach((rentalService) => {
        state.rentalServices.push({
          id: rentalService.rentalServiceId,
          contactName: rentalService.customer.name,
          contactEmail: rentalService.customer.email,
          contactNum: rentalService.customer.phoneNum,
          pickUpTime: format(new Date(rentalService.reservationStart), "Pp"),
          returnTime: format(new Date(rentalService.reservationEnd), "Pp"),
          reservationStart: rentalService.reservationStart,
          reservationEnd: rentalService.reservationEnd,
          make: rentalService.vehicle.make,
          model: rentalService.vehicle.model,
          vin: rentalService.vehicle.vin,
          color: rentalService.vehicle.color,
        });
      });
    },
    add(state, action: PayloadAction<RentalService>) {
      state.rentalServices.push(action.payload);
    },
    delete(state, action: PayloadAction<number>) {
      const deleteId = action.payload;
      state.rentalServices = state.rentalServices.filter((rentalService) => rentalService.id !== deleteId);
      state.selectedRentalService = null;
    },
    update(state, action: PayloadAction<{ id: number; reservationStart: string; reservationEnd: string }>) {
      const { id, reservationStart, reservationEnd } = action.payload;
      const existing = state.rentalServices.find((r) => r.id === id);
      if (existing) {
        existing.reservationStart = reservationStart;
        existing.reservationEnd = reservationEnd;
        existing.pickUpTime = format(new Date(reservationStart), "Pp");
        existing.returnTime = format(new Date(reservationEnd), "Pp");
      }
      if (state.selectedRentalService?.id === id) {
        state.selectedRentalService.reservationStart = reservationStart;
        state.selectedRentalService.reservationEnd = reservationEnd;
        state.selectedRentalService.pickUpTime = format(new Date(reservationStart), "Pp");
        state.selectedRentalService.returnTime = format(new Date(reservationEnd), "Pp");
      }
    },
    resetRentalServices(state) {
      state.rentalServices = [];
    },
    setSelectedRentalService(state, action: PayloadAction<number[]>) {
      state.selectedRentalServiceById = action.payload;
    },
  },
});

export const rentalActions = rentalSlice.actions;

export default rentalSlice.reducer;
