import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { colors } from "#colors";
import {
  ChatScreenNavigationProps,
  NewChatScreenRouteProp,
} from "#navigation/types";
import { DataItem, ProfileImage } from "#components";
import { ScreenContainer } from "#ui";
import { useAppDispatch, useAppSelector } from "#store/hooks";
import { setStoredUsers } from "#store/slices";
import commonStyles from "#styles";
import { DataItemTypeEnum, IUsers } from "#types";
import { searchUsers } from "#utils";
import { HeaderLeft, HeaderRight, NoResult, SearchInput } from "./ui";

const NewChatScreen = () => {
  const navigation = useNavigation<ChatScreenNavigationProps>();
  const route = useRoute<NewChatScreenRouteProp>();

  const dispatch = useAppDispatch();
  const authorizedUserData = useAppSelector((state) => state.auth.userData);
  const storedUsers = useAppSelector((state) => state.users.storedUsers);

  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<IUsers | null>(null);
  const [isNoResultFound, setIsNoResultFound] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [chatName, setChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const selectedUsersFlatList = useRef<any>();

  const isGroupChat = route?.params?.isGroupChat;
  const chatId = route?.params?.chatId;
  const existingUsers = route?.params?.existingUsers;

  const isNewChat = !chatId;
  const isGroupChatDisabled = !selectedUsers.length || (isNewChat && !chatName);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <HeaderLeft onPress={() => navigation.goBack()} />,
      headerRight: () => (
        <HeaderRight
          isGroupChat={!!isGroupChat}
          title={isNewChat ? "Create" : "Add"}
          disabled={isGroupChatDisabled}
          onPress={() => {
            isNewChat ? navigateToChatList() : navigateToChatSettings();
          }}
        />
      ),
      headerTitle: isGroupChat ? "Add participants" : "New Chat",
    });
  }, [chatName, selectedUsers]);

  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (!searchTerm || searchTerm === "") {
        setUsers(null);
        setIsNoResultFound(false);
        return;
      }

      setIsLoading(true);

      const usersResult = await searchUsers(searchTerm);
      delete usersResult[authorizedUserData?.userId!];
      existingUsers?.forEach((user) => {
        delete usersResult[user];
      });
      setUsers(usersResult);

      if (!Object.keys(usersResult).length) {
        setIsNoResultFound(true);
      } else {
        setIsNoResultFound(false);

        dispatch(setStoredUsers({ users: usersResult }));
      }

      setIsLoading(false);
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchTerm]);

  const navigateToChatList = () => {
    navigation.navigate("ChatList", {
      selectedUsers,
      chatName,
    });
  };

  const navigateToChatSettings = () => {
    if (chatId) {
      navigation.navigate("ChatSettings", {
        selectedUsers,
        chatId,
      });
    }
  };

  const userPressed = (userId: string) => {
    if (isGroupChat) {
      const newSelectedUsers = selectedUsers.includes(userId)
        ? selectedUsers.filter((id) => id !== userId)
        : selectedUsers.concat(userId);

      setSelectedUsers(newSelectedUsers);
    } else {
      navigation.navigate("ChatList", {
        selectedUserId: userId,
      });
    }
  };

  const renderAddedItem = (itemData: { item: string }) => {
    const userId = itemData.item;
    const userData = storedUsers?.[userId];
    return (
      <ProfileImage
        size={40}
        uri={userData?.profilePicture}
        userId={userId}
        onPress={() => {
          userPressed(userId);
        }}
        style={styles.selectedUserStyle}
      />
    );
  };

  const renderFoundItem = (itemData: { item: string }) => {
    const userId = itemData.item;
    const userData = users![userId];
    return (
      <DataItem
        key={userId}
        title={`${userData.firstName} ${userData.lastName}`}
        subTitle={userData.about!}
        image={userData.profilePicture}
        onPress={() => {
          userPressed(userId);
        }}
        type={isGroupChat ? DataItemTypeEnum.Checkbox : undefined}
        isChecked={selectedUsers.includes(userId)}
      />
    );
  };

  return (
    <ScreenContainer>
      {isNewChat && isGroupChat && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textBox}
            placeholder="Enter a name for your chat"
            autoCorrect={false}
            autoComplete="off"
            value={chatName}
            onChangeText={(text) => setChatName(text)}
          />
        </View>
      )}
      {isGroupChat && (
        <View>
          <FlatList
            data={selectedUsers}
            renderItem={renderAddedItem}
            keyExtractor={(item) => item}
            horizontal
            ref={(ref) => (selectedUsersFlatList.current = ref)}
            onContentSizeChange={() =>
              selectedUsersFlatList.current.scrollToEnd()
            }
            style={styles.selectedUserList}
          />
        </View>
      )}
      <SearchInput onChangeText={(text) => setSearchTerm(text)} />
      {isLoading && (
        <View style={commonStyles.center}>
          <ActivityIndicator size={"large"} color={colors.primary} />
        </View>
      )}

      {!isLoading && !isNoResultFound && users && (
        <FlatList
          data={Object.keys(users)}
          keyExtractor={(item) => item}
          renderItem={renderFoundItem}
        />
      )}
      {!isLoading && isNoResultFound && <NoResult icon="question" />}
      {!isLoading && !users && <NoResult icon="users" />}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    width: "100%",
    marginVertical: 10,
    paddingHorizontal: 12,
    paddingVertical: 16,
    backgroundColor: colors.nearlyWhite,
    flexDirection: "row",
    borderRadius: 4,
  },
  textBox: {
    color: colors.textColor,
    width: "100%",
    fontFamily: "Alkatra-Regular",
    letterSpacing: 0.3,
  },
  selectedUserList: {
    paddingVertical: 4,
  },
  selectedUserStyle: {
    marginRight: 8,
  },
});

export default NewChatScreen;
