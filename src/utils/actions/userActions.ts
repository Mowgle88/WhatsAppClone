import database from "@react-native-firebase/database";

export const getUserData = async (userId: string) => {
  try {
    const userRef = database().ref(`users/${userId}`);

    const snapshot = await userRef.once("value");
    return snapshot.val();
  } catch (error) {}
};

export const searchUsers = async (queryText: string) => {
  const searchTerm = queryText.toLowerCase();

  try {
    const userRef = database().ref(`users`);

    const queryRef = userRef
      .orderByChild("fullName")
      .startAt(searchTerm)
      .endAt(searchTerm + "\uf8ff");

    const snapshot = await queryRef.once("value");

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
    const userRef = database().ref(`userChats/${userId}`);

    const snapshot = await userRef.once("value");
    return snapshot.val();
  } catch (error) {
    console.log(error);
  }
};

export const deleteUserChat = async (userId: string, key: string) => {
  try {
    const chatRef = database().ref(`userChats/${userId}/${key}`);

    await chatRef.remove();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const addUserChat = async (userId: string, chatId: string) => {
  try {
    const chatRef = database().ref(`userChats/${userId}`).push();

    await chatRef.set(chatId);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
