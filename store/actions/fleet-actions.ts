import type { AppDispatch } from "../index";
import axios from "axios";
import { fleetActions } from "../slices/fleet-slice";
import { uiActions } from "../slices/ui-slice";
import type { Vehicle } from "../../types";

export const fetchVehicles = (token: string) => {
  return async (dispatch: AppDispatch) => {
    try {
      const response = await axios.get("http://localhost:5000/api/fleet", {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(fleetActions.fetch(response.data));
    } catch (err) {
      dispatch(
        uiActions.showNotification({
          title: "Fetch Error",
          message: "Something went wrong. Please try again.",
        }),
      );
    }
  };
};

export const addVehicle = (vehicleInfo: Vehicle, token: string) => {
  return async (dispatch: AppDispatch) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/fleet",
        {
          vin: vehicleInfo.vin,
          make: vehicleInfo.make,
          model: vehicleInfo.model,
          color: vehicleInfo.color,
          mileage: vehicleInfo.mileage,
          class: vehicleInfo.class,
          classCode: vehicleInfo.classCode,
          state: vehicleInfo.state,
          licensePlate: vehicleInfo.licensePlate,
          isRented: vehicleInfo.isRented,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const newVehicle: Vehicle = {
        vehicleId: response.data.vehicle.vehicleId,
        vin: response.data.vehicle.vin,
        make: response.data.vehicle.make,
        model: response.data.vehicle.model,
        color: response.data.vehicle.color,
        mileage: response.data.vehicle.mileage,
        class: response.data.vehicle.class,
        classCode: response.data.vehicle.classCode,
        state: response.data.vehicle.state,
        licensePlate: response.data.vehicle.licensePlate,
        isRented: response.data.vehicle.isRented,
      };
      dispatch(fleetActions.add(newVehicle));
    } catch (err) {
      dispatch(
        uiActions.showNotification({
          title: "Add Vehicle Error",
          message: "Something went wrong. Please try again.",
        }),
      );
    }
  };
};

export const updateVehicle = (vehicleInfo: Vehicle, token: string) => {
  return async (dispatch: AppDispatch) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/fleet/${vehicleInfo.vehicleId}`,
        {
          vehicleId: vehicleInfo.vehicleId,
          vin: vehicleInfo.vin,
          make: vehicleInfo.make,
          model: vehicleInfo.model,
          color: vehicleInfo.color,
          mileage: vehicleInfo.mileage,
          class: vehicleInfo.class,
          classCode: vehicleInfo.classCode,
          state: vehicleInfo.state,
          licensePlate: vehicleInfo.licensePlate,
          isRented: vehicleInfo.isRented,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const updatedVehicle: Vehicle = {
        vehicleId: response.data.vehicle.vehicleId,
        vin: response.data.vehicle.vin,
        make: response.data.vehicle.make,
        model: response.data.vehicle.model,
        color: response.data.vehicle.color,
        mileage: response.data.vehicle.mileage,
        class: response.data.vehicle.class,
        classCode: response.data.vehicle.classCode,
        state: response.data.vehicle.state,
        licensePlate: response.data.vehicle.licensePlate,
        isRented: response.data.vehicle.isRented,
      };
      dispatch(fleetActions.updateVehicle(updatedVehicle));
    } catch (err) {
      dispatch(
        uiActions.showNotification({
          title: "Update Vehicle Error",
          message: "Something went wrong. Please try again.",
        }),
      );
    }
  };
};

export const deleteVehicle = (vehicleId: number, token: string) => {
  return async (dispatch: AppDispatch) => {
    try {
      await axios.delete(`http://localhost:5000/api/fleet/${vehicleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(fleetActions.deleteVehicle(vehicleId));
      dispatch(
        uiActions.showNotification({
          title: "Success",
          message: "Vehicle has been deleted from the inventory.",
        }),
      );
    } catch (err) {
      dispatch(
        uiActions.showNotification({
          title: "Delete Vehicle Error",
          message: "Something went wrong. Please try again.",
        }),
      );
    }
  };
};

export const resetVehiclesList = () => {
  return (dispatch: AppDispatch) => {
    dispatch(fleetActions.resetVehicles());
  };
};

export const setSelectedVehicles = (selectedVehiclesId: number[]) => {
  return (dispatch: AppDispatch) => {
    dispatch(fleetActions.setSelectedVehicleById(selectedVehiclesId));
  };
};
