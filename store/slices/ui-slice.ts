import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { UiNotificationResponse } from "../../types";

interface UiState {
  notification: UiNotificationResponse | null;
}

const initialState: UiState = {
  notification: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    showNotification(state, action: PayloadAction<UiNotificationResponse>) {
      state.notification = {
        title: action.payload.title,
        message: action.payload.message,
      };
    },
    clearNotification(state) {
      state.notification = null;
    },
  },
});

export const uiActions = uiSlice.actions;

export default uiSlice.reducer;
