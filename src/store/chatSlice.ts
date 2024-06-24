import { createSlice } from "@reduxjs/toolkit";
import { IChatData, IObjectData } from "../shared/types/types";

export interface ChatState {
  chatsData: IObjectData<IChatData>;
}

const initialState: ChatState = {
  chatsData: {},
};

export const chatSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    setChatsData: (state, action) => {
      state.chatsData = { ...action.payload.chatsData };
    },
  },
});

export const { setChatsData } = chatSlice.actions;

export default chatSlice.reducer;
