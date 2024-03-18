import { initializeApp } from "firebase/app";
import { getDatabase, ref } from "firebase/database";
import { FIREBASE_API_KEY } from "@env";

export const getFirebaseApp = () => {
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: FIREBASE_API_KEY,
    authDomain: "whatsapp-c2023.firebaseapp.com",
    databaseURL: "https://whatsapp-c2023-default-rtdb.firebaseio.com",
    projectId: "whatsapp-c2023",
    storageBucket: "whatsapp-c2023.appspot.com",
    messagingSenderId: "580708244205",
    appId: "1:580708244205:web:f4e45ff398bec2d7e84ae4",
    measurementId: "G-ECLVBSPYFE",
  };

  // Initialize Firebase
  return initializeApp(firebaseConfig);
};

export const getDbRef = () => {
  const app = getFirebaseApp();
  return ref(getDatabase(app));
};
