import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { User, UserRole } from '../types';
import { BASE_URL } from '../constants/api';

interface UserState {
  userName: string | null;
  userId: string | null;
  token: string | null;
  tokenExpTime: string | null;
  isLoggedIn: boolean;
  userRole: UserRole | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  userName: null,
  userId: null,
  token: null,
  tokenExpTime: null,
  isLoggedIn: false,
  userRole: null,
  isLoading: false,
  error: null,
};

export const signInUser = createAsyncThunk(
  'user/signIn',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/accounts/signIn`, { email, password });
      const data = response.data;
      const tokenExpTime = new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString();
      const userData: User = {
        userName: data.userName,
        userId: data.userId,
        token: data.token,
        tokenExpTime,
        userRole: data.userRole as UserRole,
      };
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      return userData;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'Sign in failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'user/register',
  async (
    payload: { userName: string; email: string; password: string; employeeRole: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      await axios.post(`${BASE_URL}/accounts/register`, payload);
      const result = await dispatch(signInUser({ email: payload.email, password: payload.password }));
      if (signInUser.rejected.match(result)) {
        return rejectWithValue(result.payload);
      }
      return result.payload;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'Registration failed');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login(state, action: PayloadAction<User>) {
      state.userName = action.payload.userName;
      state.userId = action.payload.userId;
      state.token = action.payload.token;
      state.tokenExpTime = action.payload.tokenExpTime;
      state.userRole = action.payload.userRole;
      state.isLoggedIn = true;
    },
    logout(state) {
      state.userName = null;
      state.userId = null;
      state.token = null;
      state.tokenExpTime = null;
      state.userRole = null;
      state.isLoggedIn = false;
      AsyncStorage.removeItem('userData');
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signInUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signInUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userName = action.payload.userName;
        state.userId = action.payload.userId;
        state.token = action.payload.token;
        state.tokenExpTime = action.payload.tokenExpTime;
        state.userRole = action.payload.userRole;
        state.isLoggedIn = true;
      })
      .addCase(signInUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { login, logout, clearError } = userSlice.actions;
export default userSlice.reducer;
