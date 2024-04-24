import React, { useEffect } from "react";
import { StyleSheet, LogBox } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SplashScreen from "react-native-splash-screen";
import messaging from "@react-native-firebase/messaging";
// eslint-disable-next-line import/no-named-as-default
import firebase from "@react-native-firebase/app";
import AppNavigator from "./navigation/AppNavigator";
import { Provider } from "react-redux";
import { MenuProvider } from "react-native-popup-menu";
import { store } from "./store/store";
import { requestNotificationPermission } from "./permissions/notificationPermissions";
import { getFCMToken } from "./utils/firebaseHelper";

LogBox.ignoreLogs(["AsyncStorage has been extracted"]);

console.log("apps: ", firebase.apps);

export default function App() {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  useEffect(() => {
    requestNotificationPermission!()
      .then((enabled) => {
        if (enabled) {
          return getFCMToken();
        }
      })
      .then((FCMToken) => console.log("FCM token: ", FCMToken));

    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log("A new FCM message arrived!", JSON.stringify(remoteMessage));
    });
    return unsubscribe;
  }, []);

  return (
    <Provider store={store}>
      <SafeAreaProvider style={styles.container}>
        <MenuProvider>
          <AppNavigator />
        </MenuProvider>
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  label: {
    color: "white",
    fontSize: 24,
    fontFamily: "Caveat-Bold",
  },
});
