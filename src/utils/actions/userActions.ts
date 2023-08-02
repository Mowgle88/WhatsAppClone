import {
  child,
  endAt,
  get,
  orderByChild,
  query,
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
