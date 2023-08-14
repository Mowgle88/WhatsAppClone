import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useAppSelector } from "../store/hooks";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  ChatScreenNavigationProps,
  ContactScreenRouteProp,
} from "../navigation/types";
import ScreenContainer from "../components/ScreenContainer";
import ProfileImage from "../components/ProfileImage";
import ScreenTitle from "../components/ScreenTitle";
import { getUserChats } from "../utils/actions/userActions";
import colors from "../constants/colors";
import UserDataItem from "../components/UserDataItem";
import { DataItemTypeEnum, IChatData, IUserData } from "../types/types";
import SubmitButton from "../components/SubmitButton";
import { removeUserFromChat } from "../utils/actions/chatActions";

const ContactScreen = () => {
  const { params } = useRoute<ContactScreenRouteProp>();
  const navigation = useNavigation<ChatScreenNavigationProps>();

  const storedUsers = useAppSelector((state) => state.users.storedUsers);
  const storedChats = useAppSelector((state) => state.chats.chatsData);
  const userData = useAppSelector((state) => state.auth.userData);

  const [commonChats, seCommonChats] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const currentUser = storedUsers[params.uid];
  const chatId = params.chatId;
  const currentChatData = chatId && storedChats[chatId];

  useEffect(() => {
    const getCommonUserChats = async () => {
      const currentUserChats: string[] = await getUserChats(currentUser.userId);
      seCommonChats(
        Object.values(currentUserChats).filter(
          (cid) => storedChats[cid] && storedChats[cid].isGroupChat
        )
      );
    };
    getCommonUserChats();
  }, []);

  const removeFromChat = useCallback(async () => {
    try {
      setIsLoading(true);

      await removeUserFromChat(
        userData as IUserData,
        currentUser,
        currentChatData as IChatData
      );
      navigation.goBack();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [navigation, isLoading]);

  return (
    <ScreenContainer>
      <View style={styles.topContainer}>
        <ProfileImage
          userId={currentUser?.userId}
          uri={currentUser.profilePicture}
          size={80}
          isShowEditButton={false}
          style={styles.image}
        />
        <ScreenTitle
          text={`${currentUser.firstName} ${currentUser.lastName}`}
        />
        {currentUser.about && (
          <Text style={styles.about} numberOfLines={2}>
            {currentUser.about}
          </Text>
        )}
      </View>
      {!!commonChats.length && (
        <>
          <Text style={styles.heading}>
            {commonChats.length} {commonChats.length === 1 ? "Group" : "Groups"}{" "}
            in common
          </Text>
          {commonChats.map((cid) => {
            const chatData = storedChats[cid];

            return (
              <UserDataItem
                key={chatData.key}
                title={chatData.chatName!}
                subTitle={chatData.latestMessageText!}
                image={chatData.chatImage!}
                type={DataItemTypeEnum.Link}
                onPress={() => {
                  navigation.push("Chat", { chatId: cid });
                }}
              />
            );
          })}
        </>
      )}

      {currentChatData &&
        currentChatData.isGroupChat &&
        (isLoading ? (
          <ActivityIndicator size={"small"} color={colors.primary} />
        ) : (
          <SubmitButton
            title="Remove from chat"
            color={colors.red}
            onPress={removeFromChat}
          />
        ))}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  image: {
    marginBottom: 20,
  },
  about: {
    fontFamily: "Alkatra-Medium",
    fontSize: 16,
    letterSpacing: 0.3,
  },
  heading: {
    fontFamily: "Alkatra-Bold",
    letterSpacing: 0.3,
    color: colors.textColor,
    marginVertical: 8,
  },
});

export default ContactScreen;
