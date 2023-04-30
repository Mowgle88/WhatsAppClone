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
      console.log(state);
    },
    setDidTryAutoLogin: (state) => {
      state.didTryAutoLogin = true;
    },
  },
});

export const { authenticate, setDidTryAutoLogin } = authSlice.actions;

export default authSlice.reducer;
