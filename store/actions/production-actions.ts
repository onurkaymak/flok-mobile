import { productionActions } from "../slices/production-slice";
import { uiActions } from "../slices/ui-slice";
import axios from "axios";
import { format } from "date-fns";
import type { AppDispatch } from "../index";
import { BASE_URL } from "../../constants/api";

export const fetchLeaderboard = (token: string) => {
  return async (dispatch: AppDispatch) => {
    try {
      const response = await axios.get("${BASE_URL}/api/production/leaderboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(productionActions.fetchLeaderboard(response.data.leaderboard));
    } catch (err) {
      dispatch(
        uiActions.showNotification({
          title: "Fetch Error",
          message: "Something went wrong fetching the leaderboard. Please try again.",
        }),
      );
    }
  };
};

export const fetchDetailingServices = (token: string) => {
  return async (dispatch: AppDispatch) => {
    try {
      const response = await axios.get("${BASE_URL}/api/production", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const services = response.data.map((s: any) => ({
        id: s.detailingServiceId,
        vin: s.vehicle.vin,
        make: s.vehicle.make,
        model: s.vehicle.model,
        detailerName: s.detailer.userName,
        createdAt: format(s.createdAt, "Pp"),
      }));

      dispatch(productionActions.fetchDetailingServices(services));
    } catch (err) {
      dispatch(
        uiActions.showNotification({
          title: "Fetch Error",
          message: "Something went wrong fetching detailing records. Please try again.",
        }),
      );
    }
  };
};

export const addDetailingService = (vin: string, detailerId: string, token: string) => {
  return async (dispatch: AppDispatch) => {
    try {
      const response = await axios.post(
        "${BASE_URL}/api/production",
        { vin, detailerId },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const newService = {
        id: response.data.vehicle.detailingServiceId,
        vin: response.data.vehicle.vin,
        make: response.data.vehicle.make,
        model: response.data.vehicle.model,
        detailerName: response.data.detailer.userName,
        createdAt: format(new Date(), "Pp"),
      };

      dispatch(productionActions.add(newService));
      dispatch(
        uiActions.showNotification({
          title: "Success",
          message: "Vehicle scan recorded successfully.",
        }),
      );
    } catch (err) {
      dispatch(
        uiActions.showNotification({
          title: "Scan Error",
          message: "Something went wrong. Please check the VIN and try again.",
        }),
      );
    }
  };
};
