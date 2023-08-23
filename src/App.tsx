import React, { useEffect } from "react";
import { StyleSheet, LogBox } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SplashScreen from "react-native-splash-screen";
import AppNavigator from "./navigation/AppNavigator";
import { Provider } from "react-redux";
import { MenuProvider } from "react-native-popup-menu";
import { store } from "./store/store";

LogBox.ignoreLogs(["AsyncStorage has been extracted"]);

export default function App() {
  useEffect(() => {
    SplashScreen.hide();
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
