import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatSettingsScreen from "../../screens/ChatSettingsScreen";
import ChatScreen from "../../screens/chat/ChatScreen";
import { RootStackParamList } from "../types";
import NewChatScreen from "../../screens/NewChatScreen";
import ContactScreen from "../../screens/ContactScreen";
import DataListScreen from "../../screens/DataListScreen";
import ImageScreen from "../../screens/ImageScreen";
import TabNavigator from "../components/TabNavigator";

const Stack = createNativeStackNavigator<RootStackParamList>();

const StackNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Group>
        <Stack.Screen
          name="Home"
          component={TabNavigator}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={{
            headerTitle: "",
            headerBackTitle: "Back",
          }}
        />
        <Stack.Screen
          name="ChatSettings"
          component={ChatSettingsScreen}
          options={{
            headerTitle: "",
            headerBackTitle: "Back",
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="Contact"
          component={ContactScreen}
          options={{
            headerTitle: "Contact info",
            headerBackTitle: "Back",
          }}
        />
        <Stack.Screen
          name="DataList"
          component={DataListScreen}
          options={{
            headerTitle: "",
            headerBackTitle: "Back",
          }}
        />
      </Stack.Group>
      <Stack.Group
        screenOptions={{
          presentation: "containedModal",
        }}
      >
        <Stack.Screen name="NewChat" component={NewChatScreen} />
        <Stack.Screen
          name="Image"
          component={ImageScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default StackNavigator;
