import { getFirebaseApp } from "../firebaseHelper";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "@firebase/util";

export const signUp = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string
) => {
  const app = getFirebaseApp();
  const auth = getAuth(app);

  try {
    await createUserWithEmailAndPassword(auth, email, password);
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
