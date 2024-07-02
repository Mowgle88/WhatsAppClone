import auth from "@react-native-firebase/auth";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import database from "@react-native-firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppDispatch } from "#store";
import { authenticate, logout } from "#store/slices";
import { IUserData } from "#types";
import { State, getFCMToken, getUserData } from "#utils";

let timer: ReturnType<typeof setTimeout> | number;

GoogleSignin.configure({
  webClientId:
    "580708244205-rfmbmspl3fkj0o1cbprnl1l2lkiipqlj.apps.googleusercontent.com",
});

export const signInWithGoogle = () => {
  return async (dispatch: AppDispatch) => {
    try {
      const isSigned = await GoogleSignin.isSignedIn();
      if (isSigned) await GoogleSignin.signOut();

      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.signIn();

      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      const { user } = await auth().signInWithCredential(googleCredential);
      const tokenResult = await user.getIdTokenResult();
      const { token, expirationTime } = tokenResult;

      let userData = await getUserData(user.uid);
      const firstName = user.displayName!.split(" ");

      if (!userData) {
        userData = await createUser(
          firstName[0],
          firstName[1],
          user.email!,
          user.uid,
          user.photoURL!
        );
      }

      const expiryDate = new Date(expirationTime);

      dispatch(authenticate({ token, userData }));
      saveDataToStorage(idToken!, user.uid, expiryDate);
      await storePushToken(userData);

      logoutOnTokenExpiration(user.uid, expiryDate, dispatch);
    } catch (error: any) {
      const errorCode = error.code;

      let message = "Something went wrong.";

      if (errorCode === statusCodes.SIGN_IN_CANCELLED) {
        message = "SIGN_IN_CANCELLED";
      } else if (errorCode === statusCodes.IN_PROGRESS) {
        message = "IN_PROGRESS";
      } else if (errorCode === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        message = "PLAY_SERVICES_NOT_AVAILABLE";
      } else {
        message = error.message;
      }
      throw new Error(message);
    }
  };
};

export const signUp = (
  firstName: string,
  lastName: string,
  email: string,
  password: string
) => {
  return async (dispatch: AppDispatch) => {
    try {
      const response = await auth().createUserWithEmailAndPassword(
        email,
        password
      );

      const { uid } = response.user;
      const tokenResult = await response.user.getIdTokenResult();
      const userData = await createUser(firstName, lastName, email, uid);
      const { token, expirationTime } = tokenResult;

      const expiryDate = new Date(expirationTime);

      dispatch(authenticate({ token, userData }));
      saveDataToStorage(token, uid, expiryDate);
      await storePushToken(userData);

      logoutOnTokenExpiration(uid, expiryDate, dispatch);
    } catch (error: any) {
      throw new Error(error.nativeErrorMessage);
    }
  };
};

export const signIn = (email: string, password: string) => {
  return async (dispatch: AppDispatch) => {
    try {
      const response = await auth().signInWithEmailAndPassword(email, password);

      const { uid } = response.user;
      const tokenResult = await response.user.getIdTokenResult();
      const userData = await getUserData(uid);
      const { token, expirationTime } = tokenResult;

      const expiryDate = new Date(expirationTime);

      dispatch(authenticate({ token, userData }));
      saveDataToStorage(token, uid, expiryDate);
      await storePushToken(userData);

      logoutOnTokenExpiration(uid, expiryDate, dispatch);
    } catch (error: any) {
      throw new Error(error.nativeErrorMessage);
    }
  };
};

const logoutOnTokenExpiration = (
  userId: string,
  expiryDate: Date,
  dispatch: AppDispatch
) => {
  const timeNow = new Date();
  const millisecondsUntilExpiry = +expiryDate - +timeNow;

  timer = setTimeout(() => {
    dispatch(userLogout(userId));
  }, millisecondsUntilExpiry);
};

export const userLogout = (userId: string) => {
  return async (dispatch: any) => {
    await removePushToken(userId);
    AsyncStorage.clear();
    clearTimeout(timer as number);
    dispatch(logout());
  };
};

export const updateSignedInUserData = async (
  userId: string,
  newData: State["inputValues"]
) => {
  const childRef = database().ref(`users/${userId}`);
  await childRef.update(newData);
};

const createUser = async (
  firstName: string,
  lastName: string,
  email: string,
  userId: string,
  profilePicture: string = ""
) => {
  const fullName = `${firstName} ${lastName}`.toLowerCase();
  const userData = {
    firstName,
    lastName,
    fullName,
    email,
    userId,
    profilePicture,
    signUpDate: new Date().toISOString(),
  };
  const childRef = database().ref(`users/${userId}`);
  await childRef.update(userData);
  return userData;
};

const saveDataToStorage = (token: string, userId: string, expiryDate: Date) => {
  AsyncStorage.setItem(
    "userData",
    JSON.stringify({
      token,
      userId,
      expiryDate: expiryDate.toISOString(),
    })
  );
};

export const storePushToken = async (userData: IUserData) => {
  const token = await getFCMToken();
  const tokenData = { ...userData.pushTokens } || {};
  const tokenArray = Object.values(tokenData);

  if (!token || tokenArray.includes(token)) {
    return;
  }

  tokenArray.push(token);

  for (let i = 0; i < tokenArray.length; i++) {
    const tok = tokenArray[i];
    tokenData[i] = tok;
  }

  const userRef = database().ref(`users/${userData.userId}/pushTokens`);
  await userRef.set(tokenData);
};

export const removePushToken = async (userId: string) => {
  const token = await getFCMToken();
  const tokenData = await getUserPushTokens(userId);

  for (const key in tokenData) {
    if (tokenData[key] === token) {
      delete tokenData[key];
      break;
    }
  }

  const userRef = database().ref(`users/${userId}/pushTokens`);
  await userRef.set(tokenData);
};

export const getUserPushTokens = async (userId: string) => {
  try {
    const userRef = database().ref(`users/${userId}/pushTokens`);
    const snapshot = await userRef.once("value");

    if (snapshot.exists()) {
      return snapshot.val();
    }
    return {};
  } catch (error) {
    console.log("getUserPushTokens", error);
  }
};
