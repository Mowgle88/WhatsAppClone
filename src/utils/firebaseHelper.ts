// import firebase, { ReactNativeFirebase } from "@react-native-firebase/app";
// import { FIREBASE_API_KEY } from "@env";
// import { Platform } from "react-native";

// export const getFirebaseApp = async () => {
//   // TODO: Add SDKs for Firebase products that you want to use
//   // https://firebase.google.com/docs/web/setup#available-libraries
//   // Your web app's Firebase configuration
//   // For Firebase JS SDK v7.20.0 and later, measurementId is optional
//   const firebaseConfig = {
//     apiKey: FIREBASE_API_KEY,
//     databaseURL: "https://whatsapp-c2023-default-rtdb.firebaseio.com",
//     projectId: "whatsapp-c2023",
//     storageBucket: "whatsapp-c2023.appspot.com",
//     messagingSenderId: "580708244205",
//     appId: "1:580708244205:web:f4e45ff398bec2d7e84ae4",
//     clientId:
//       "580708244205-rfmbmspl3fkj0o1cbprnl1l2lkiipqlj.apps.googleusercontent.com",
//   };

//   const iosCredentials: ReactNativeFirebase.FirebaseAppOptions = {
//     ...firebaseConfig,
//     appId: "1:580708244205:ios:b4ddb8bbae45d2cee84ae4",
//     clientId:
//       "580708244205-kor63lpq62nsd09fq1hbskmgo7qgjdhu.apps.googleusercontent.com",
//   };

//   const androidCredentials = {
//     ...firebaseConfig,
//     appId: "1:580708244205:android:762c5f1f6c7ad208e84ae4",
//     clientId:
//       "580708244205-vvk3omv1up1mrqamcnv893dc3lo90cik.apps.googleusercontent.com",
//   };

//   const credentials = Platform.select({
//     web: firebaseConfig,
//     ios: iosCredentials,
//     android: androidCredentials,
//   });

//   await firebase.initializeApp(
//     credentials!,
//     Platform.OS === "ios" ? "WHATS_APP_CLONE" : undefined
//   );
// };
