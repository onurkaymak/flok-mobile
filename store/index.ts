import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user-slice';
import fleetReducer from './fleet-slice';
import rentalReducer from './rental-slice';
import productionReducer from './production-slice';
import uiReducer from './ui-slice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    fleet: fleetReducer,
    rental: rentalReducer,
    production: productionReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
