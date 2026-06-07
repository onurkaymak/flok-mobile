import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./slices/user-slice";
import fleetReducer from "./slices/fleet-slice";
import rentalReducer from "./slices/rental-slice";
import uiReducer from "./slices/ui-slice";
import productionReducer from "./slices/production-slice";

const store = configureStore({
  reducer: {
    user: userReducer,
    fleet: fleetReducer,
    rental: rentalReducer,
    ui: uiReducer,
    production: productionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
