import React, { useCallback, useEffect, useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import colors from "../constants/colors";
import { useNavigation, useRoute } from "@react-navigation/native";
import ScreenContainer from "../components/ScreenContainer";
import Bubble from "../components/Bubble";
import {
  ChatScreenRouteProp,
  RootScreenNavigationProps,
} from "../navigation/types";
import { BubbleEnum, IUserData } from "../types/types";
import { useAppSelector } from "../store/hooks";
import { createChat, sendTextMesage } from "../utils/actions/chatActions";

const ChatScreen: React.FC = () => {
  const navigation = useNavigation<RootScreenNavigationProps>();
  const route = useRoute<ChatScreenRouteProp>();

  const userData = useAppSelector((state) => state.auth.userData);
  const storedUsers = useAppSelector((state) => state.users.storedUsers);
  const storedChats = useAppSelector((state) => state.chats.chatsData);

  const [messageText, setMessageText] = useState("");
  const [chatId, setChatId] = useState(route?.params?.chatId);
  const [errorBannerText, setErrorBannerText] = useState("");

  const chatData =
    (chatId && storedChats[chatId]) || route?.params?.newChatData;

  useEffect(() => {
    const otherUserId = chatData?.users.find((uid) => uid !== userData!.userId);
    const otherUserData: IUserData = storedUsers[`${otherUserId}`];
    const headerTitle =
      otherUserData && `${otherUserData.firstName} ${otherUserData.lastName}`;

    navigation.setOptions({
      headerTitle: headerTitle,
    });
  }, []);

  const sendMassage = useCallback(async () => {
    try {
      if (!chatId) {
        const id = await createChat(userData!.userId, chatData!);
        id && setChatId(id);
      }

      await sendTextMesage(chatId!, userData!.userId, messageText);

      setMessageText("");
    } catch (error) {
      console.log(error);
      setErrorBannerText("Message faild to send.");
      setTimeout(() => {
        setErrorBannerText("");
      }, 3000);
    }
  }, [messageText, chatId]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        keyboardVerticalOffset={100}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <ImageBackground
          source={require("../assets/images/droplet.jpeg")}
          resizeMode="cover"
          style={styles.backgroundImage}
        >
          <ScreenContainer containerStyle={styles.screenContainer}>
            {!chatId && (
              <Bubble
                type={BubbleEnum.System}
                text={"This is a new chat. Say hi."}
              />
            )}
            {errorBannerText && (
              <Bubble type={BubbleEnum.Error} text={errorBannerText} />
            )}
          </ScreenContainer>
        </ImageBackground>
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.button} onPress={() => {}}>
            <Icon name="add-outline" size={24} color={colors.blue} />
          </TouchableOpacity>
          <TextInput
            value={messageText}
            onChangeText={(text) => setMessageText(text)}
            onSubmitEditing={sendMassage}
            style={styles.input}
          />
          {messageText && (
            <TouchableOpacity
              style={[styles.button, styles.sendButton]}
              onPress={sendMassage}
            >
              <Icon name="send-sharp" size={20} color={"white"} />
            </TouchableOpacity>
          )}
          {!messageText && (
            <TouchableOpacity style={styles.button} onPress={() => {}}>
              <Icon name="camera-outline" size={24} color={colors.blue} />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenContainer: {
    backgroundColor: "transparent",
  },
  backgroundImage: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 10,
    height: 50,
  },
  button: {
    width: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButton: {
    backgroundColor: colors.blue,
    borderRadius: 50,
    paddingLeft: 4,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 50,
    borderColor: colors.lightGrey,
    marginHorizontal: 16,
    paddingHorizontal: 12,
  },
});

export default ChatScreen;
