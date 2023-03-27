import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SplashScreen from "react-native-splash-screen";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import ChatListScreen from "./screens/ChatListScreen";
import ChatSettingsScreen from "./screens/ChatSettingsScreen";
import { RootStackParamList } from "./navigation/types";

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <SafeAreaProvider style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={ChatListScreen} />
          <Stack.Screen
            name="ChatSettings"
            component={ChatSettingsScreen}
            options={{
              headerTitle: "Settings",
              headerBackTitle: "Back",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3498db",
  },
  label: {
    color: "white",
    fontSize: 24,
    fontFamily: "Caveat-Bold",
  },
});
