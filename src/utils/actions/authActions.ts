import { getFirebaseApp } from "../firebaseHelper";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "@firebase/util";
import { getDatabase, set, ref, child } from "firebase/database";

export const signUp = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string
) => {
  const app = getFirebaseApp();
  const auth = getAuth(app);

  try {
    const response = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const { uid } = response.user;

    await createUser(firstName, lastName, email, uid);
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
