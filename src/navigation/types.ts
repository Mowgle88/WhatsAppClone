import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type {
  CompositeNavigationProp,
  NavigatorScreenParams,
  RouteProp,
} from "@react-navigation/native";

export type RootStackParamList = {
  Home: NavigatorScreenParams<TabParamList>;
  Chat: {
    newChatData?: {
      users: string[];
    };
    chatId?: string;
  };
  ChatSettings: undefined;
  NewChat: undefined;
};

export type TabParamList = {
  ChatList: { selectedUserId: string };
  Settings: undefined;
};

export type RootScreenNavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "Chat"
>;

export type ChatListScreenRouteProp = RouteProp<TabParamList, "ChatList">;

export type ChatScreenRouteProp = RouteProp<RootStackParamList, "Chat">;

export type ChatScreenNavigationProps = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, "ChatList">,
  NativeStackNavigationProp<RootStackParamList>
>;
