import { createSlice } from "@reduxjs/toolkit";
import { IUserData, IUsers } from "../types/types";

export interface UserState {
  storedUsers: IUsers;
}

const initialState: UserState = {
  storedUsers: {},
};

export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setStoredUsers: (state, action) => {
      const newUsers: IUsers = action.payload.newUsers;
      const existingUsers: IUsers = state.storedUsers;

      const usersArray: IUserData[] = Object.values(newUsers);

      for (let user of usersArray) {
        existingUsers[user.userId] = user;
      }

      state.storedUsers = existingUsers;
    },
  },
});

export const { setStoredUsers } = userSlice.actions;

export default userSlice.reducer;
