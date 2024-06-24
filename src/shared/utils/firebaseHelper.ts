import messaging from "@react-native-firebase/messaging";

export async function getFCMToken() {
  try {
    return await messaging().getToken();
  } catch (error) {
    console.log("FCM token error: ", error);
  }
}
