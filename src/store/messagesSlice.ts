import { createSlice } from "@reduxjs/toolkit";
import { IObjectData, IChatMessagesData } from "../types/types";

export interface MessagesState {
  messagesData: IObjectData<IObjectData<IChatMessagesData>>;
}

const initialState: MessagesState = {
  messagesData: {},
};

export const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setChatMessages: (state, action) => {
      const existingMessages = state.messagesData;

      const { chatId, messagesData } = action.payload;

      existingMessages[chatId] = messagesData;

      state.messagesData = existingMessages;
    },
  },
});

export const { setChatMessages } = messagesSlice.actions;

export default messagesSlice.reducer;
