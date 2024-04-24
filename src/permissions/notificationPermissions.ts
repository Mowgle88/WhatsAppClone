import messaging from "@react-native-firebase/messaging";
import { Platform } from "react-native";
import { PERMISSIONS, request } from "react-native-permissions";

const requestAndroidPermission = async () => {
  try {
    const enabled = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
    return enabled === "granted";
  } catch (err) {
    console.log(err);
  }
};

const requestIOSPermission = async () => {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    console.log("Authorization status:", authStatus);
    return enabled;
  } catch (err) {
    console.log(err);
  }
};

export const requestNotificationPermission = Platform.select({
  android: () => {
    return requestAndroidPermission();
  },
  ios: () => {
    return requestIOSPermission();
  },
});
