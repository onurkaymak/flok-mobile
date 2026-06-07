import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { User, UserRole } from "../../types";

interface UserState {
  userName: string | null;
  userId: string | null;
  token: string | null;
  tokenExpTime: string | null;
  isLoggedIn: boolean;
  userRole: UserRole | null;
}

const initialState: UserState = {
  userName: null,
  userId: null,
  token: null,
  tokenExpTime: null,
  isLoggedIn: false,
  userRole: null,
};

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    login(state, action: PayloadAction<User>) {
      state.userName = action.payload.name;
      state.userId = action.payload.userId;
      state.token = action.payload.token;
      state.tokenExpTime = action.payload.tokenExpTime;
      state.isLoggedIn = true;
      state.userRole = action.payload.userRole;
    },
    logout(state) {
      state.userId = null;
      state.token = null;
      state.tokenExpTime = null;
      state.isLoggedIn = false;
      state.userRole = null;
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice.reducer;
