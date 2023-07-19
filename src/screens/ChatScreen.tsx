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
import {
  ChatScreenRouteProp,
  RootScreenNavigationProps,
} from "../navigation/types";
import { useAppSelector } from "../store/hooks";
import { IUserData } from "../types/types";

const ChatScreen: React.FC = () => {
  const navigation = useNavigation<RootScreenNavigationProps>();
  const route = useRoute<ChatScreenRouteProp>();
  const chatData = route?.params?.newChatData;

  const userData = useAppSelector((state) => state.auth.userData);
  const storedUsers = useAppSelector((state) => state.users.storedUsers);

  const [messageText, setMessageText] = useState("");

  const getChatTitleFromName = () => {
    const otherUserId = chatData?.users.find((uid) => uid !== userData!.userId);
    const otherUserData: IUserData = storedUsers[`${otherUserId}`];
    return (
      otherUserData && `${otherUserData.firstName} ${otherUserData.lastName}`
    );
  };

  useEffect(() => {
    navigation.setOptions({
      headerTitle: getChatTitleFromName(),
    });
  }, []);

  const sendMassage = useCallback(() => {
    setMessageText("");
  }, [messageText]);

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
        />
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
