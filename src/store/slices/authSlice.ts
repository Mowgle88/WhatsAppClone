import { createSlice } from "@reduxjs/toolkit";
import { IUserData } from "#types";

export interface AuthState {
  token: string | null;
  userData: IUserData | null;
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
    updateLoggetInUserData: (state, action) => {
      state.userData = { ...state.userData, ...action.payload.newData };
    },
  },
});

export const {
  authenticate,
  setDidTryAutoLogin,
  logout,
  updateLoggetInUserData,
} = authSlice.actions;

export default authSlice.reducer;
