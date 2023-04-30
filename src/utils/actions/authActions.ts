import { getFirebaseApp } from "../firebaseHelper";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { FirebaseError } from "@firebase/util";
import { getDatabase, set, ref, child } from "firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authenticate, logout } from "../../store/authSlice";
import { getUserData } from "./userActions";
import type { AppDispatch } from "../../store/store";

let timer: number;

export const signUp = (
  firstName: string,
  lastName: string,
  email: string,
  password: string
) => {
  return async (dispatch: AppDispatch) => {
    const app = getFirebaseApp();
    const auth = getAuth(app);

    try {
      const response = await createUserWithEmailAndPassword(
        auth,
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

      logoutOnTokenExpiration(expiryDate, dispatch);
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        const errorCode = error.code;

        let message = "Something went wrong.";

        if (errorCode === "auth/email-already-in-use") {
          message = "This email is already is use";
        }

        throw new Error(message);
      }
    }
  };
};

export const signIn = (email: string, password: string) => {
  return async (dispatch: AppDispatch) => {
    const app = getFirebaseApp();
    const auth = getAuth(app);

    try {
      const response = await signInWithEmailAndPassword(auth, email, password);

      const { uid } = response.user;
      const tokenResult = await response.user.getIdTokenResult();
      const userData = await getUserData(uid);
      const { token, expirationTime } = tokenResult;

      const expiryDate = new Date(expirationTime);

      dispatch(authenticate({ token, userData }));
      saveDataToStorage(token, uid, expiryDate);

      logoutOnTokenExpiration(expiryDate, dispatch);
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        const errorCode = error.code;

        let message = "Something went wrong.";

        if (
          errorCode === "auth/wrong-password" ||
          errorCode === "auth/user-not-found"
        ) {
          message = "The username or password was incorrect";
        }

        throw new Error(message);
      }
    }
  };
};

const logoutOnTokenExpiration = (expiryDate: Date, dispatch: AppDispatch) => {
  const timeNow = new Date();
  const millisecondsUntilExpiry = +expiryDate - +timeNow;

  timer = setTimeout(() => {
    dispatch(userLogout());
  }, millisecondsUntilExpiry);
};

export const userLogout = () => {
  return async (dispatch: any) => {
    AsyncStorage.clear();
    clearTimeout(timer);
    dispatch(logout());
  };
};

const createUser = async (
  firstName: string,
  lastName: string,
  email: string,
  userId: string
) => {
  const fullName = `${firstName} ${lastName}`.toLowerCase();
  const userData = {
    firstName,
    lastName,
    fullName,
    email,
    userId,
    signUpDate: new Date().toISOString(),
  };

  const dbRef = ref(getDatabase());
  const childRef = child(dbRef, `users/${userId}`);
  await set(childRef, userData);
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
