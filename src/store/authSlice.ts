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
    about: string;
    profilePicture: string | null;
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
