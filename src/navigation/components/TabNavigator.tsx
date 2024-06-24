import React from "react";
import Lottie from "lottie-react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ChatListScreen from "../../screens/ChatListScreen";
import SettingsScreen from "../../screens/SettingsScreen";
import { TabParamList } from "../types";
import AnimatedTabBar from "./AnimatedTabBar";
import { StyleSheet } from "react-native";
import colors from "../../shared/constants/colors";

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerTitle: "",
        headerShadowVisible: false,
        tabBarStyle: {
          backgroundColor: colors.extraLightGrey,
        },
      }}
      tabBar={(props) => <AnimatedTabBar {...props} />}
    >
      <Tab.Screen
        name="ChatList"
        component={ChatListScreen}
        options={{
          tabBarLabel: "Chats",
          // @ts-ignore
          tabBarIcon: ({ ref }) => (
            <Lottie
              ref={ref}
              loop={false}
              source={require("../../assets/lottie/chat.icon.json")}
              style={styles.icon}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: "Settings",
          // @ts-ignore
          tabBarIcon: ({ ref }) => (
            <Lottie
              ref={ref}
              loop={false}
              source={require("../../assets/lottie/settings.icon.json")}
              style={styles.icon}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  icon: {
    height: 36,
    width: 36,
  },
});

export default TabNavigator;
