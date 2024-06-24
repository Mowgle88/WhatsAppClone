import { createSlice } from "@reduxjs/toolkit";
import { IUserData, IUsers } from "../shared/types/types";

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
      const users: IUsers = action.payload.users;
      const existingUsers: IUsers = state.storedUsers;

      const usersArray: IUserData[] = Object.values(users);

      for (let user of usersArray) {
        existingUsers[user.userId] = user;
      }

      state.storedUsers = existingUsers;
    },
  },
});

export const { setStoredUsers } = userSlice.actions;

export default userSlice.reducer;
