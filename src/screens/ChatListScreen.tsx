import React, { useEffect, useMemo } from "react";
import { FlatList } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import {
  RootScreenNavigationProps,
  ChatListScreenRouteProp,
} from "../navigation/types";
import CustomHeaderButton from "../components/CustomHeaderButton";
import { useAppSelector } from "../store/hooks";
import UserDataItem from "../components/UserDataItem";
import ScreenContainer from "../components/ScreenContainer";
import ScreenTitle from "../components/ScreenTitle";

const ChatListScreen: React.FC = () => {
  const navigation = useNavigation<RootScreenNavigationProps>();
  const route = useRoute<ChatListScreenRouteProp>();
  const selectedUser = route?.params?.selectedUserId;

  const authorizedUserData = useAppSelector((state) => state.auth.userData);
  const storedUsers = useAppSelector((state) => state.users.storedUsers);
  const userChats = useAppSelector((state) => state.chats.chatsData);
  const userChatsList = useMemo(
    () =>
      Object.values(userChats).sort(
        (a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt)
      ),
    [userChats]
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            <Item
              title="New chat"
              iconName="create-outline"
              onPress={() => {
                navigation.navigate("NewChat");
              }}
            />
          </HeaderButtons>
        );
      },
    });
  }, []);

  useEffect(() => {
    if (!selectedUser) {
      return;
    }
    const chatUsers = [selectedUser, authorizedUserData!.userId];

    const navigationProps = {
      newChatData: {
        users: chatUsers,
      },
    };

    navigation.navigate("Chat", navigationProps);
  }, [route?.params]);

  return (
    <ScreenContainer>
      <ScreenTitle text={"Chats"} />
      <FlatList
        data={userChatsList}
        renderItem={(itemData) => {
          const chatData = itemData.item;
          const chatId = chatData.key;

          const otherUserId = chatData.users.find(
            (uid) => uid !== authorizedUserData!.userId
          );
          const otherUser = storedUsers[otherUserId!];

          return (
            otherUser && (
              <UserDataItem
                userData={otherUser}
                lastMessage="This will be a message..."
                onPress={(): void => {
                  navigation.navigate("Chat", { chatId });
                }}
              />
            )
          );
        }}
      />
    </ScreenContainer>
  );
};

export default ChatListScreen;
