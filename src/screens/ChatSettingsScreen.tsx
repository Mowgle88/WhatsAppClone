import React, { useCallback, useReducer, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import IonIcon from "react-native-vector-icons/Ionicons";
import { ChatSettingsScreenRouteProp } from "../navigation/types";
import { useAppSelector } from "../store/hooks";
import ScreenContainer from "../components/ScreenContainer";
import ScreenTitle from "../components/ScreenTitle";
import ProfileImage from "../components/ProfileImage";
import Input from "../components/Input";
import { IdEnum } from "../types/types";
import { State, reducer } from "../utils/redusers/formReducer";
import { updateChatData } from "../utils/actions/chatActions";
import colors from "../constants/colors";
import SubmitButton from "../components/SubmitButton";
import { validateInput } from "../utils/actions/formActions";

const ChatSettingsScreen: React.FC = () => {
  const { params } = useRoute<ChatSettingsScreenRouteProp>();

  const chatData = useAppSelector(
    (state) => state.chats?.chatsData[params?.chatId]
  );
  const userData = useAppSelector((state) => state.auth.userData);

  const [isLoading, setIsLoading] = useState(false);
  const [succesMessage, setSuccesMessage] = useState(false);

  const initialState: State = {
    inputValues: {
      chatName: chatData.chatName,
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
      await updateChatData(params?.chatId, userData!.userId, updateValues);

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

  return (
    <ScreenContainer>
      <ScreenTitle text="Chat Settings" />
      <ScrollView contentContainerStyle={styles.scrollView}>
        <ProfileImage
          isShowEditButton
          size={80}
          chatId={params?.chatId}
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
        {succesMessage && <Text>Saved!</Text>}
        {isLoading ? (
          <ActivityIndicator
            size={"small"}
            color={colors.primary}
            // style={styles.button}
          />
        ) : (
          hasChanges() && (
            <SubmitButton
              title="Save changes"
              color={colors.primary}
              onPress={saveHandler}
              // style={styles.button}
              disabled={!formState.formIsValid}
            />
          )
        )}
      </ScrollView>
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
  },
});

export default ChatSettingsScreen;
