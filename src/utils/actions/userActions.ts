import {
  child,
  endAt,
  get,
  orderByChild,
  push,
  query,
  remove,
  startAt,
} from "firebase/database";
import { getDbRef } from "../firebaseHelper";

export const getUserData = async (userId: string) => {
  try {
    const dbRef = getDbRef();

    const userRef = child(dbRef, `users/${userId}`);
    const snapshot = await get(userRef);
    return snapshot.val();
  } catch (error) {}
};

export const searchUsers = async (queryText: string) => {
  const searchTerm = queryText.toLowerCase();

  try {
    const dbRef = getDbRef();
    const userRef = child(dbRef, `users`);

    const queryRef = query(
      userRef,
      orderByChild("fullName"),
      startAt(searchTerm),
      endAt(searchTerm + "\uf8ff")
    );

    const snapshot = await get(queryRef);

    if (snapshot.exists()) {
      return snapshot.val();
    }

    return {};
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getUserChats = async (userId: string) => {
  try {
    const dbRef = getDbRef();
    const userRef = child(dbRef, `userChats/${userId}`);

    const snapshot = await get(userRef);
    return snapshot.val();
  } catch (error) {
    console.log(error);
  }
};

export const deleteUserChat = async (userId: string, key: string) => {
  try {
    const dbRef = getDbRef();
    const chatRef = child(dbRef, `userChats/${userId}/${key}`);

    await remove(chatRef);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const addUserChat = async (userId: string, chatId: string) => {
  try {
    const dbRef = getDbRef();
    const chatRef = child(dbRef, `userChats/${userId}`);

    await push(chatRef, chatId);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
