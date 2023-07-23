import { createSlice } from "@reduxjs/toolkit";
import { IChatsData } from "../types/types";

export interface ChatState {
  chatsData: IChatsData;
}

const initialState: ChatState = {
  chatsData: {},
};

export const chatSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    setChatsData: (state, action) => {
      state.chatsData = action.payload.chatsData;
    },
  },
});

export const { setChatsData } = chatSlice.actions;

export default chatSlice.reducer;
