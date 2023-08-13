import { child, get, push, remove, set, update } from "firebase/database";
import { getDbRef } from "../firebaseHelper";
import { IChatMessagesData, ISendedData } from "../../types/types";

export const createChat = async (
  loggedInUserId: string,
  chatData: {
    users: string[];
  }
) => {
  const newChatData = {
    ...chatData,
    createdBy: loggedInUserId,
    updatedBy: loggedInUserId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const dbRef = getDbRef();
  const newChat = await push(child(dbRef, "chats"), newChatData);

  const chatUsers = newChatData.users;
  for (let i = 0; i < chatUsers.length; i++) {
    const userId = chatUsers[i];
    await push(child(dbRef, `userChats/${userId}`), newChat.key);
  }

  return newChat.key;
};

const sendMessage = async (
  chatId: string,
  senderId: string,
  messageText?: string,
  imageUrl?: string,
  replyTo?: string | null
) => {
  const dbRef = getDbRef();
  const messagesRef = child(dbRef, `messages/${chatId}`);

  const messageData: IChatMessagesData = {
    sentBy: senderId,
    sentAt: new Date().toISOString(),
    text: messageText!,
  };

  if (replyTo) {
    messageData.replyTo = replyTo;
  }

  if (imageUrl) {
    messageData.imageUrl = imageUrl;
  }

  await push(messagesRef, messageData);

  const chatRef = child(dbRef, `chats/${chatId}`);
  await update(chatRef, {
    updatedBy: senderId,
    updatedAt: new Date().toISOString(),
    latestMessageText: messageText,
  });
};

export const sendTextMessage = async ({
  chatId,
  senderId,
  messageText,
  replyTo,
}: ISendedData) => {
  await sendMessage(chatId, senderId, messageText, "", replyTo!);
};

export const sendImage = async ({
  chatId,
  senderId,
  imageUrl,
  messageText,
  replyTo,
}: ISendedData) => {
  await sendMessage(chatId, senderId, messageText, imageUrl, replyTo!);
};

export const starMessage = async (
  messageId: string,
  chatId: string,
  userId: string
) => {
  try {
    const dbRef = getDbRef();

    const childRef = child(
      dbRef,
      `userStarredMessages/${userId}/${chatId}/${messageId}`
    );

    const snapshot = await get(childRef);

    if (snapshot.exists()) {
      await remove(childRef);
    } else {
      const starredMessageData = {
        messageId,
        chatId,
        starredAt: new Date().toISOString(),
      };

      await set(childRef, starredMessageData);
    }
  } catch (error) {
    console.log(error);
  }
};

export const updateChatData = async (
  chatId: string,
  userId: string,
  chatData: { chatImage?: string; chatName?: string }
) => {
  const dbRef = getDbRef();
  const chatRef = child(dbRef, `chats/${chatId}`);

  await update(chatRef, {
    ...chatData,
    updatedAt: new Date().toISOString(),
    updatedBy: userId,
  });
};
