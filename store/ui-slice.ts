import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UiNotification } from '../types';

interface UiState {
  notification: UiNotification | null;
}

const initialState: UiState = {
  notification: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showNotification(state, action: PayloadAction<UiNotification>) {
      state.notification = action.payload;
    },
    clearNotification(state) {
      state.notification = null;
    },
  },
});

export const { showNotification, clearNotification } = uiSlice.actions;
export default uiSlice.reducer;
