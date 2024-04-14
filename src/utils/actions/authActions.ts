import auth from "@react-native-firebase/auth";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import database from "@react-native-firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authenticate, logout } from "../../store/authSlice";
import { getUserData } from "./userActions";
import type { AppDispatch } from "../../store/store";
import { State } from "../redusers/formReducer";

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

      logoutOnTokenExpiration(expiryDate, dispatch);
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
    // const app = getFirebaseApp();
    // const auth = getAuth(app);
    // const auth = initializeAuth(app, {
    //   persistence: getReactNativePersistence(AsyncStorage),
    // });

    try {
      // const response = await createUserWithEmailAndPassword(
      //   auth,
      //   email,
      //   password
      // );
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

      logoutOnTokenExpiration(expiryDate, dispatch);
    } catch (error: any) {
      // if (error instanceof FirebaseError) {
      const errorCode = error.code;
      let message = "Something went wrong.";

      if (errorCode === "auth/email-already-in-use") {
        message = "This email is already is use";
      }

      throw new Error(message);
      // }
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

      logoutOnTokenExpiration(expiryDate, dispatch);
    } catch (error: any) {
      throw new Error(error.nativeErrorMessage);
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
