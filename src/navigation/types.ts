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
      isGroupChat: boolean;
      chatName: string;
    };
    chatId?: string;
  };
  ChatSettings: undefined;
  NewChat:
    | {
        isGroupChat: boolean;
      }
    | undefined;
};

export type TabParamList = {
  ChatList: {
    selectedUserId?: string;
    selectedUsers?: string[];
    chatName?: string;
  };
  Settings: undefined;
};

export type RootScreenNavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "Chat"
>;

export type ChatListScreenRouteProp = RouteProp<TabParamList, "ChatList">;
export type ChatScreenRouteProp = RouteProp<RootStackParamList, "Chat">;
export type NewChatScreenRouteProp = RouteProp<RootStackParamList, "NewChat">;

export type ChatScreenNavigationProps = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, "ChatList">,
  NativeStackNavigationProp<RootStackParamList>
>;
