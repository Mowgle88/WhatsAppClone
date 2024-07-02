import React from "react";
import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Lottie from "lottie-react-native";
import { colors } from "#colors";
import { lottie } from "#constants";
import { TabParamList } from "#navigation/types";
import { ChatListScreen, SettingsScreen } from "#screens";
import AnimatedTabBar from "./AnimatedTabBar";

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
              source={lottie.chat}
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
              source={lottie.settings}
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
