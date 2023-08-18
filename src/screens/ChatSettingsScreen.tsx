import React, { useCallback, useReducer, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import IonIcon from "react-native-vector-icons/Ionicons";
import {
  ChatSettingsScreenRouteProp,
  RootScreenNavigationProps,
} from "../navigation/types";
import { useAppSelector } from "../store/hooks";
import ScreenContainer from "../components/ScreenContainer";
import ScreenTitle from "../components/ScreenTitle";
import ProfileImage from "../components/ProfileImage";
import Input from "../components/Input";
import DataItem from "../components/DataItem";
import SubmitButton from "../components/SubmitButton";
import { DataItemTypeEnum, IUserData, IdEnum } from "../types/types";
import { State, reducer } from "../utils/redusers/formReducer";
import {
  removeUserFromChat,
  updateChatData,
} from "../utils/actions/chatActions";
import colors from "../constants/colors";
import { validateInput } from "../utils/actions/formActions";

const ChatSettingsScreen: React.FC = () => {
  const { params } = useRoute<ChatSettingsScreenRouteProp>();
  const navigation = useNavigation<RootScreenNavigationProps>();

  const chatId = params?.chatId;

  const chatData = useAppSelector(
    (state) => state.chats?.chatsData[chatId] || {}
  );
  const userData = useAppSelector((state) => state.auth.userData);
  const storedUsers = useAppSelector((state) => state.users.storedUsers);

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

        <View style={styles.sectionContainer}>
          <Text style={styles.heading}>
            {chatData.users.length} Participants
          </Text>
          <DataItem
            title="Add users"
            icon="person-add-outline"
            type={DataItemTypeEnum.Button}
            onPress={() => {}}
          />
          {chatData.users.slice(0, 3).map((uid) => {
            const currentUser = storedUsers[uid];
            return (
              <DataItem
                key={uid}
                image={currentUser.profilePicture}
                title={`${currentUser.firstName} ${currentUser.lastName}`}
                subTitle={currentUser.about}
                type={
                  uid !== userData?.userId ? DataItemTypeEnum.Link : undefined
                }
                onPress={() => {
                  uid !== userData?.userId &&
                    navigation.navigate("Contact", { uid, chatId });
                }}
              />
            );
          })}
          {chatData.users.length > 3 && (
            <DataItem
              type={DataItemTypeEnum.Link}
              title="View all"
              hideImage
              onPress={() => {
                navigation.navigate("DataList", {
                  title: "Participants",
                  data: chatData.users,
                  type: "users",
                  chatId: chatId,
                });
              }}
            />
          )}
        </View>

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
      </ScrollView>
      {
        <SubmitButton
          title="Leave chat"
          color={colors.red}
          onPress={leaveChat}
          style={styles.leaveChatButton}
        />
      }
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
  sectionContainer: {
    width: "100%",
    marginTop: 10,
  },
  heading: {
    marginVertical: 8,
    color: colors.textColor,
    fontFamily: "Alkatra-Medium",
    letterSpacing: 0.3,
  },
  leaveChatButton: {
    marginBottom: 24,
  },
});

export default ChatSettingsScreen;
