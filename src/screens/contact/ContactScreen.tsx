import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useAppSelector } from "../../store/hooks";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  ChatScreenNavigationProps,
  ContactScreenRouteProp,
} from "../../navigation/types";
import ScreenContainer from "../../shared/ui/ScreenContainer";
import ProfileImage from "../../shared/components/ProfileImage";
import ScreenTitle from "../../shared/ui/ScreenTitle";
import { getUserChats } from "../../shared/utils/actions/userActions";
import colors from "../../shared/constants/colors";
import DataItem from "../../shared/components/DataItem";
import {
  DataItemTypeEnum,
  IChatData,
  IUserData,
} from "../../shared/types/types";
import SubmitButton from "../../shared/ui/SubmitButton";
import { removeUserFromChat } from "../../shared/utils/actions/chatActions";
import CommonChatsList from "./components/CommonChatsList";

const ContactScreen = () => {
  const { params } = useRoute<ContactScreenRouteProp>();
  const navigation = useNavigation<ChatScreenNavigationProps>();

  const storedUsers = useAppSelector((state) => state.users.storedUsers);
  const storedChats = useAppSelector((state) => state.chats.chatsData);
  const userData = useAppSelector((state) => state.auth.userData);
  const starredMessages = useAppSelector(
    (state) => state.messages.starredMesages
  );

  const [commonChats, seCommonChats] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const currentUser = storedUsers[params.uid];
  const chatId = params?.chatId;
  const currentChatData = chatId && storedChats[chatId];

  const chatStarredMessages = useMemo(() => {
    if (!chatId) return null;
    return starredMessages[chatId] || null;
  }, [starredMessages]);

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
          onNavigate={(uri: string) => {
            navigation.navigate("Image", {
              uri,
            });
          }}
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
        <CommonChatsList
          commonChats={commonChats}
          storedChats={storedChats}
          onPress={(cid: string) => {
            navigation.push("Chat", { chatId: cid });
          }}
        />
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
              chatId: chatId!,
            });
          }}
        />
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
});

export default ContactScreen;
