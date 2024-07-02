import database from "@react-native-firebase/database";
import { IChatData, IChatMessagesData, ISendedData, IUserData } from "#types";
import {
  addUserChat,
  deleteUserChat,
  getUserChats,
  getUserPushTokens,
} from "#utils";

import { CLOUD_MESSAGING_SERVER_KEY } from "@env";

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

  const newChat = database().ref("chats").push();
  await newChat.set(newChatData);

  const chatUsers = newChatData.users;
  for (let i = 0; i < chatUsers.length; i++) {
    const userId = chatUsers[i];
    const userChat = database().ref(`userChats/${userId}`).push();
    await userChat.set(newChat.key);
  }

  return newChat.key;
};

const getMessageData = async (chatId: string, messageId: string) => {
  const messagesRef = database().ref(`messages/${chatId}/${messageId}`);
  const snapshot = await messagesRef.once("value");
  return snapshot.val();
};

const sendMessage = async (
  chatId: string,
  senderId: string,
  messageText?: string,
  imageUrl?: string,
  replyTo?: string | null,
  type?: string
) => {
  const messagesRef = database().ref(`messages/${chatId}`).push();

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

  if (type) {
    messageData.type = type;
  }

  await messagesRef.set(messageData);

  const chatRef = database().ref(`chats/${chatId}`);

  await chatRef.update({
    updatedBy: senderId,
    updatedAt: new Date().toISOString(),
    latestMessageText: messageText,
  });

  return messagesRef.key;
};

export const sendTextMessage = async ({
  chatId,
  senderData,
  messageText,
  replyTo,
  chatUsers,
}: ISendedData) => {
  await sendMessage(chatId, senderData.userId, messageText, "", replyTo!);

  const otherUsers = chatUsers!.filter((uid) => uid !== senderData.userId);
  await sendPushNotificationForUsers(
    chatId,
    otherUsers,
    `${senderData.firstName} ${senderData.lastName}`,
    messageText!
  );
};

export const sendInfoMessage = async (
  chatId: string,
  senderId: string,
  messageText: string
) => {
  await sendMessage(chatId, senderId, messageText, "", null, "info");
};

export const sendImage = async ({
  chatId,
  senderData,
  imageUrl,
  messageText,
  replyTo,
  chatUsers,
}: ISendedData) => {
  const messageId = await sendMessage(
    chatId,
    senderData.userId,
    messageText,
    imageUrl,
    replyTo!
  );

  const messageData = await getMessageData(chatId, messageId!);
  const otherUsers = chatUsers!.filter((uid) => uid !== senderData.userId);

  await sendPushNotificationForUsers(
    chatId,
    otherUsers,
    `${senderData.firstName} ${senderData.lastName}`,
    messageText!,
    messageData.imageUrl
  );
};

export const starMessage = async (
  messageId: string,
  chatId: string,
  userId: string
) => {
  try {
    const childRef = database().ref(
      `userStarredMessages/${userId}/${chatId}/${messageId}`
    );

    const snapshot = await childRef.once("value");

    if (snapshot.exists()) {
      await childRef.remove();
    } else {
      const starredMessageData = {
        messageId,
        chatId,
        starredAt: new Date().toISOString(),
      };
      await childRef.set(starredMessageData);
    }
  } catch (error) {
    console.log(error);
  }
};

export const updateChatData = async (
  chatId: string,
  userId: string,
  chatData: Partial<IChatData>
) => {
  const chatRef = database().ref(`chats/${chatId}`);

  await chatRef.update({
    ...chatData,
    updatedAt: new Date().toISOString(),
    updatedBy: userId,
  });
};

export const removeUserFromChat = async (
  userLoggedInData: IUserData,
  userToRemoveData: IUserData,
  chatData: IChatData
) => {
  const userToRemoveId = userToRemoveData.userId;
  const newUsers = chatData.users.filter((uid) => uid !== userToRemoveId);
  await updateChatData(chatData.key, userLoggedInData.userId, {
    users: newUsers,
  });

  const userChats = await getUserChats(userToRemoveId);

  for (const key in userChats) {
    const currentChatId = userChats[key];

    if (currentChatId === chatData.key) {
      await deleteUserChat(userToRemoveId, key);
      break;
    }
  }

  const messageText =
    userLoggedInData.firstName === userToRemoveData.firstName
      ? `${userLoggedInData.firstName} left the chat`
      : `${userLoggedInData.firstName} removed ${userToRemoveData.firstName} from the chat`;
  await sendInfoMessage(chatData.key, userLoggedInData.userId, messageText);
};

export const addUsersToChat = async (
  userLoggedInData: IUserData,
  usersToAddData: IUserData[],
  chatData: IChatData
) => {
  const existingUsers = Object.values(chatData.users);
  const newUsers: string[] = [];

  let userAddedName = "";

  for await (const userToAdd of usersToAddData) {
    const userToAddId = userToAdd.userId;
    if (existingUsers.includes(userToAddId)) return;
    newUsers.push(userToAddId);

    await addUserChat(userToAddId, chatData.key);

    userAddedName += `${userToAdd.firstName} ${userToAdd.lastName}, `;
  }

  if (!newUsers.length) return;

  await updateChatData(chatData.key, userLoggedInData.userId, {
    users: existingUsers.concat(newUsers),
  });

  const messageText = `${userLoggedInData.firstName} ${
    userLoggedInData.lastName
  } added ${userAddedName.slice(0, -2)} to the chat`;
  await sendInfoMessage(chatData.key, userLoggedInData.userId, messageText);
};

const sendPushNotificationForUsers = async (
  chatId: string,
  chatUsers: string[],
  title: string,
  body: string,
  image: string = ""
) => {
  try {
    for await (const uid of chatUsers) {
      const tokens: {
        [key: string]: string;
      } = await getUserPushTokens(uid);
      for await (const token of Object.values(tokens)) {
        await fetch("https://fcm.googleapis.com/fcm/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `key=${CLOUD_MESSAGING_SERVER_KEY}`,
          },
          body: JSON.stringify({
            to: token,
            notification: {
              body,
              title,
              image,
            },
            data: {
              chatId,
            },
          }),
        });
      }
    }
  } catch (error) {
    console.log("sendError", error);
  }
};
