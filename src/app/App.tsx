import React, { useEffect } from "react";
import { StyleSheet, LogBox } from "react-native";
import { Provider } from "react-redux";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { MenuProvider } from "react-native-popup-menu";
import { HeaderButtonsProvider } from "react-navigation-header-buttons";
import SplashScreen from "react-native-splash-screen";
import messaging from "@react-native-firebase/messaging";
// eslint-disable-next-line import/no-named-as-default
import firebase from "@react-native-firebase/app";
import { AppNavigator } from "#navigation";
import { requestNotificationPermission } from "#permissions";
import { store } from "#store";
import { getFCMToken } from "#utils";

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
        <HeaderButtonsProvider stackType={"native"}>
          <MenuProvider>
            <AppNavigator />
          </MenuProvider>
        </HeaderButtonsProvider>
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
