import React from "react";
import { StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import ChatListScreen from "../screens/ChatListScreen";
import SettingsScreen from "../screens/SettingsScreen";
import ChatSettingsScreen from "../screens/ChatSettingsScreen";
import ChatScreen from "../screens/ChatScreen";
import { RootStackParamList, TabParamList } from "./types";
import colors from "../constants/colors";
import { useAppDispatch } from "../store/hooks";
import { userLogout } from "../utils/actions/authActions";

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator: React.FC = () => {
  const dispatch = useAppDispatch();

  return (
    <Tab.Navigator
      screenOptions={{
        headerTitle: "",
      }}
    >
      <Tab.Screen
        name="ChatList"
        component={ChatListScreen}
        options={{
          tabBarLabel: "Chats",
          tabBarIcon: ({ size, color }) => (
            <Icon name="chatbubble-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ size, color }) => (
            <Icon name="settings-outline" size={size} color={color} />
          ),
          headerRight: () => (
            <Icon
              name="exit-outline"
              size={24}
              color={colors.blue}
              style={styles.logout}
              onPress={() => {
                dispatch(userLogout());
              }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={TabNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ChatScreen"
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
          headerTitle: "Settings",
          headerBackTitle: "Back",
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  logout: {
    marginRight: 12,
  },
});

export default MainNavigator;
