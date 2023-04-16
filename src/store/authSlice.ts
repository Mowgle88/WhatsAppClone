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
}

const initialState: AuthState = {
  token: null,
  userData: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authenticate: (state, action) => {
      const { payload } = action;
      state.token = payload.token;
      state.userData = payload.userData;
    },
  },
});

export const { authenticate } = authSlice.actions;

export default authSlice.reducer;
