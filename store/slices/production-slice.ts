import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { DetailingService, LeaderboardEntry } from "../../types";

interface ProductionState {
  detailingServices: DetailingService[];
  leaderboard: LeaderboardEntry[];
}

const initialState: ProductionState = {
  detailingServices: [],
  leaderboard: [],
};

const productionSlice = createSlice({
  name: "production",
  initialState,
  reducers: {
    fetchDetailingServices(state, action: PayloadAction<DetailingService[]>) {
      state.detailingServices = action.payload;
    },
    fetchLeaderboard(state, action: PayloadAction<LeaderboardEntry[]>) {
      state.leaderboard = action.payload;
    },
    add(state, action: PayloadAction<DetailingService>) {
      state.detailingServices.push(action.payload);
    },
    resetDetailingServices(state) {
      state.detailingServices = [];
      state.leaderboard = [];
    },
  },
});

export const productionActions = productionSlice.actions;

export default productionSlice.reducer;
