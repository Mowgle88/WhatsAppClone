import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import IonIcon from "react-native-vector-icons/Ionicons";
import {
  ChatSettingsScreenRouteProp,
  RootScreenNavigationProps,
} from "#navigation/types";
import { colors } from "#colors";
import { DataItem, Input, ProfileImage } from "#components";
import { ScreenContainer, ScreenTitle, SubmitButton } from "#ui";
import { useAppSelector } from "#store/hooks";
import { DataItemTypeEnum, IUserData, IdEnum } from "#types";
import {
  State,
  addUsersToChat,
  reducer,
  removeUserFromChat,
  updateChatData,
  validateInput,
} from "#utils";
import { ParticipantsList } from "./components";

const ChatSettingsScreen: React.FC = () => {
  const { params } = useRoute<ChatSettingsScreenRouteProp>();
  const navigation = useNavigation<RootScreenNavigationProps>();

  const chatId = params?.chatId;
  const selectedUsers = params?.selectedUsers;

  const chatData = useAppSelector(
    (state) => state.chats?.chatsData[chatId] || {}
  );
  const userData = useAppSelector((state) => state.auth.userData);
  const storedUsers = useAppSelector((state) => state.users.storedUsers);
  const starredMessages = useAppSelector(
    (state) => state.messages.starredMesages
  );

  const chatStarredMessages = useMemo(() => {
    if (!chatId) return null;
    return starredMessages[chatId] || null;
  }, [starredMessages]);

  const [isLoading, setIsLoading] = useState(false);
  const [succesMessage, setSuccesMessage] = useState(false);

  const initialState: State = {
    inputValues: {
      chatName: chatData?.chatName,
    },
    inputValidities: {
      chatName: undefined,
    },
    formIsValid: false,
  };

  const [formState, dispatchFormState] = useReducer(reducer, initialState);

  const inputChangedHandler = useCallback(
    (id: IdEnum, value: string) => {
      const result = validateInput(id, value);
      dispatchFormState({ id, validationResult: result, value });
    },
    [dispatchFormState]
  );

  const saveHandler = useCallback(async () => {
    const updateValues = formState.inputValues;
    try {
      setIsLoading(true);
      await updateChatData(chatId, userData!.userId, updateValues);

      setSuccesMessage(true);
      setTimeout(() => {
        setSuccesMessage(false);
      }, 2000);
    } catch (error: any) {
      Alert.alert("An error occurred", error.message);
    } finally {
      setIsLoading(false);
    }
  }, [formState]);

  const hasChanges = () => {
    const currentValues = formState.inputValues;

    return currentValues.chatName !== chatData.chatName;
  };

  const leaveChat = useCallback(async () => {
    try {
      setIsLoading(true);

      await removeUserFromChat(
        userData as IUserData,
        userData as IUserData,
        chatData
      );
      navigation.popToTop();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [navigation, isLoading]);

  useEffect(() => {
    if (!selectedUsers) {
      return;
    }
    const selectedUserData: IUserData[] = [];
    selectedUsers.forEach((uid) => {
      if (uid === userData?.userId) return;
      if (!storedUsers[uid]) {
        console.log("No user data found in the data store");
        return;
      }
      selectedUserData.push(storedUsers[uid]);
    });

    addUsersToChat(userData as IUserData, selectedUserData, chatData);
  }, [selectedUsers]);

  if (!chatData.users) return null;

  return (
    <ScreenContainer>
      <ScreenTitle text="Chat Settings" />
      <ScrollView
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <ProfileImage
          isShowEditButton
          size={80}
          chatId={chatId}
          userId={userData!.userId}
          uri={chatData.chatImage}
          onNavigate={(uri: string) => {
            navigation.navigate("Image", {
              uri,
            });
          }}
        />
        <Input
          id={IdEnum.ChatName}
          label="Chat name"
          autoCapitalize="none"
          initialValue={chatData.chatName}
          icon="people-outline"
          IconPack={IonIcon}
          onInputChanged={inputChangedHandler}
          errorText={formState.inputValidities.chatName}
        />

        <ParticipantsList
          chatData={chatData}
          storedUsers={storedUsers}
          loggedInUserId={userData?.userId!}
          onPressAddUsers={() => {
            navigation.navigate("NewChat", {
              isGroupChat: true,
              existingUsers: chatData.users,
              chatId,
            });
          }}
          onPressItem={(uid) => {
            uid !== userData?.userId &&
              navigation.navigate("Contact", { uid, chatId });
          }}
          onPressViewAll={function (): void {
            navigation.navigate("DataList", {
              title: "Participants",
              type: "users",
              chatId: chatId,
            });
          }}
        />
        {succesMessage && <Text>Saved!</Text>}
        {isLoading ? (
          <ActivityIndicator size={"small"} color={colors.primary} />
        ) : (
          hasChanges() && (
            <SubmitButton
              title="Save changes"
              color={colors.primary}
              onPress={saveHandler}
              disabled={!formState.formIsValid}
            />
          )
        )}
        {chatStarredMessages && (
          <DataItem
            type={DataItemTypeEnum.Link}
            title="Starred messages"
            hideImage
            icon="star-outline"
            onPress={() => {
              navigation.navigate("DataList", {
                title: "Starred messages",
                type: "messages",
                chatId: chatId,
              });
            }}
          />
        )}
      </ScrollView>
      <SubmitButton
        title="Leave chat"
        color={colors.red}
        onPress={leaveChat}
        style={styles.leaveChatButton}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 24,
  },
  leaveChatButton: {
    marginBottom: 24,
  },
});

export default ChatSettingsScreen;
