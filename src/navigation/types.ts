import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type {
  CompositeNavigationProp,
  NavigatorScreenParams,
  RouteProp,
} from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

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
  ChatSettings: {
    chatId: string;
    selectedUsers?: string[];
  };
  NewChat:
    | {
        isGroupChat?: boolean;
        existingUsers?: string[];
        chatId?: string;
      }
    | undefined;
  Contact: {
    uid: string;
    chatId?: string;
  };
  DataList: {
    title: string;
    type: string;
    chatId: string;
  };
  Image: {
    uri: string;
  };
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
export type ContactScreenRouteProp = RouteProp<RootStackParamList, "Contact">;
export type ChatSettingsScreenRouteProp = RouteProp<
  RootStackParamList,
  "ChatSettings"
>;
export type DataListScreenRouteProp = RouteProp<RootStackParamList, "DataList">;
export type ImageScreenRouteProp = RouteProp<RootStackParamList, "Image">;

export type ChatScreenNavigationProps = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, "ChatList">,
  NativeStackNavigationProp<RootStackParamList>
>;
