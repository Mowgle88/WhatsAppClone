import { createSlice } from "@reduxjs/toolkit";

export interface AuthState {
  token: string | null;
  userData: {
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    userId: string;
    signUpDate: string;
  } | null;
  didTryAutoLogin: boolean;
}

const initialState: AuthState = {
  token: null,
  userData: null,
  didTryAutoLogin: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authenticate: (state, action) => {
      const { payload } = action;
      state.token = payload.token;
      state.userData = payload.userData;
      state.didTryAutoLogin = true;
    },
    setDidTryAutoLogin: (state) => {
      state.didTryAutoLogin = true;
    },
    logout: (state) => {
      state.token = null;
      state.userData = null;
      state.didTryAutoLogin = false;
    },
  },
});

export const { authenticate, setDidTryAutoLogin, logout } = authSlice.actions;

export default authSlice.reducer;
