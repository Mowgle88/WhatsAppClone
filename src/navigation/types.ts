import type { StackNavigationProp } from "@react-navigation/stack";

export type RootStackParamList = {
  Home: undefined;
  ChatSettings: undefined;
};

export type RootScreenNavigationProps = StackNavigationProp<
  RootStackParamList,
  "ChatSettings"
>;
