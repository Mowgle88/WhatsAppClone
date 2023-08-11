import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { useRoute } from "@react-navigation/native";
import { ChatSettingsScreenRouteProp } from "../navigation/types";
import { useAppSelector } from "../store/hooks";
import ScreenContainer from "../components/ScreenContainer";
import ScreenTitle from "../components/ScreenTitle";
import ProfileImage from "../components/ProfileImage";

const ChatSettingsScreen: React.FC = () => {
  const { params } = useRoute<ChatSettingsScreenRouteProp>();

  const chatData = useAppSelector(
    (state) => state.chats?.chatsData[params?.chatId]
  );
  const userData = useAppSelector((state) => state.auth.userData);

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
        <Text>{chatData.chatName}</Text>
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
