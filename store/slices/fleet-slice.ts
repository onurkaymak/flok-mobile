import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { Vehicle } from "../../types";

interface FleetState {
  vehicles: Vehicle[];
  selectedVehicles: number[];
}

const initialState: FleetState = {
  vehicles: [],
  selectedVehicles: [],
};

const fleetSlice = createSlice({
  name: "fleet",
  initialState: initialState,
  reducers: {
    fetch(state, action: PayloadAction<Vehicle[]>) {
      state.vehicles.push(...action.payload);
    },
    add(state, action: PayloadAction<Vehicle>) {
      state.vehicles.push(action.payload);
    },
    resetVehicles(state) {
      state.vehicles = [];
    },
    setSelectedVehicleById(state, action: PayloadAction<number[]>) {
      state.selectedVehicles = [...action.payload];
    },
    updateVehicle(state, action: PayloadAction<Vehicle>) {
      const vehicleId = action.payload.vehicleId;
      const updatedVehicle = action.payload;
      const foundedVehicle = state.vehicles.find((vehicle) => vehicle.vehicleId === vehicleId);
      if (foundedVehicle) {
        foundedVehicle.vehicleId = updatedVehicle.vehicleId;
        foundedVehicle.vin = updatedVehicle.vin;
        foundedVehicle.make = updatedVehicle.make;
        foundedVehicle.model = updatedVehicle.model;
        foundedVehicle.color = updatedVehicle.color;
        foundedVehicle.mileage = updatedVehicle.mileage;
        foundedVehicle.class = updatedVehicle.class;
        foundedVehicle.classCode = updatedVehicle.classCode;
        foundedVehicle.state = updatedVehicle.state;
        foundedVehicle.licensePlate = updatedVehicle.licensePlate;
        foundedVehicle.isRented = updatedVehicle.isRented;
      }
    },
    deleteVehicle(state, action: PayloadAction<number>) {
      const selectedVehicleId = action.payload;
      state.vehicles = state.vehicles.filter((vehicle) => vehicle.vehicleId !== selectedVehicleId);
    },
  },
});

export const fleetActions = fleetSlice.actions;

export default fleetSlice.reducer;
