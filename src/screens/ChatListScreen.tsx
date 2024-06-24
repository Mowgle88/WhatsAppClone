import React, { useEffect, useMemo } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import {
  RootScreenNavigationProps,
  ChatListScreenRouteProp,
  RootStackParamList,
} from "../navigation/types";
import CustomHeaderButton from "../shared/components/CustomHeaderButton";
import { useAppSelector } from "../store/hooks";
import DataItem from "../shared/components/DataItem";
import ScreenContainer from "../shared/components/ScreenContainer";
import ScreenTitle from "../shared/components/ScreenTitle";
import colors from "../shared/constants/colors";

const ChatListScreen: React.FC = () => {
  const navigation = useNavigation<RootScreenNavigationProps>();
  const route = useRoute<ChatListScreenRouteProp>();
  const selectedUser = route?.params?.selectedUserId;
  const selectedUserList = route?.params?.selectedUsers || [];
  const chatName = route?.params?.chatName || "";

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
    if (!selectedUser && !selectedUserList) {
      return;
    }

    let chatData;
    let navigationProps: RootStackParamList["Chat"];

    if (selectedUser) {
      chatData = userChatsList.find(
        (cd) => !cd.isGroupChat && cd.users.includes(selectedUser)
      );
    }

    if (chatData) {
      navigationProps = { chatId: chatData.key };
    } else {
      const chatUsers = selectedUserList.length
        ? selectedUserList
        : [selectedUser!];

      if (!chatUsers.includes(authorizedUserData!.userId)) {
        chatUsers.push(authorizedUserData!.userId);
      }

      navigationProps = {
        newChatData: {
          users: chatUsers,
          isGroupChat: !!selectedUserList.length,
          chatName,
        },
      };
    }

    navigation.navigate("Chat", navigationProps);
  }, [route?.params]);

  return (
    <ScreenContainer>
      <ScreenTitle text={"Chats"} />
      <View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("NewChat", { isGroupChat: true });
          }}
        >
          <Text style={styles.newGroupText}>New group</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={userChatsList}
        keyExtractor={(item) => item.key}
        renderItem={(itemData) => {
          const chatData = itemData.item;
          const chatId = chatData.key;
          const isGroupChat = chatData.isGroupChat;

          let title = "";
          const subTitle = chatData.latestMessageText || "New chat";
          let image = "";

          if (isGroupChat) {
            title = chatData.chatName!;
            image = chatData.chatImage!;
          } else {
            const otherUserId = chatData.users.find(
              (uid) => uid !== authorizedUserData!.userId
            );
            const otherUser = storedUsers[otherUserId!];

            if (!otherUser) return null;

            title = `${otherUser.firstName} ${otherUser.lastName}`;
            image = otherUser.profilePicture;
          }

          return (
            <DataItem
              key={chatId}
              title={title}
              subTitle={subTitle}
              image={image}
              onPress={(): void => {
                navigation.navigate("Chat", { chatId });
              }}
            />
          );
        }}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  newGroupText: {
    color: colors.blue,
    fontSize: 17,
  },
});

export default ChatListScreen;
