import type { StackNavigationProp } from "@react-navigation/stack";

export type RootStackParamList = {
  Home: TabParamList;
  ChatSettings: undefined;
  ChatScreen: undefined;
};

export type TabParamList = {
  ChatList: undefined;
  Settings: undefined;
};

export type RootScreenNavigationProps = StackNavigationProp<
  RootStackParamList,
  "ChatSettings"
>;
