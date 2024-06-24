import { createSlice } from "@reduxjs/toolkit";
import {
  IObjectData,
  IChatMessagesData,
  IStarredMessage,
} from "../shared/types/types";

export interface MessagesState {
  messagesData: IObjectData<IObjectData<IChatMessagesData>>;
  starredMesages: IObjectData<IObjectData<IStarredMessage>>;
}

const initialState: MessagesState = {
  messagesData: {},
  starredMesages: {},
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
    setStarredMessages: (state, action) => {
      const { starredMessages } = action.payload;
      state.starredMesages = { ...starredMessages };
    },
    addStarreMessage: (state, action) => {
      const { starredMessageData } = action.payload;
      state.starredMesages[starredMessageData.messageId] = starredMessageData;
    },
    removeStarreMessage: (state, action) => {
      const { messageId } = action.payload;
      delete state.starredMesages[messageId];
    },
  },
});

export const {
  setChatMessages,
  setStarredMessages,
  addStarreMessage,
  removeStarreMessage,
} = messagesSlice.actions;

export default messagesSlice.reducer;
