import React, { useEffect, useMemo } from "react";
import { FlatList } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { DataItem } from "#components";
import {
  DataListScreenRouteProp,
  RootScreenNavigationProps,
} from "#navigation/types";
import { useAppSelector } from "#store/hooks";
import { DataItemTypeEnum } from "#types";
import { ScreenContainer } from "#ui";

const DataListScreen = () => {
  const navigation = useNavigation<RootScreenNavigationProps>();
  const route = useRoute<DataListScreenRouteProp>();

  const { title: headerTitle, type, chatId } = route?.params;

  const storedUsers = useAppSelector((state) => state.users.storedUsers);
  const userData = useAppSelector((state) => state.auth.userData);
  const chatData = useAppSelector(
    (state) => state.chats?.chatsData[chatId] || {}
  );
  const messagesData = useAppSelector((state) => state.messages.messagesData);
  const starredMessages = useAppSelector(
    (state) => state.messages.starredMesages
  );

  const chatStarredMessages = useMemo(() => {
    if (!chatId) return {};
    return starredMessages[chatId] || {};
  }, [starredMessages]);

  const flatListData =
    type === "users"
      ? chatData.users
      : Object.values(chatStarredMessages)
          .map((data) => data.messageId)
          .reverse();

  useEffect(() => {
    navigation.setOptions({
      headerTitle,
    });
  }, [headerTitle]);

  const renderItem = (itemData: { item: string }) => {
    let key, onPress, image, title, subTitle, itemType;

    if (type === "users") {
      const uid = itemData.item;
      const currentUser = storedUsers[uid];

      if (!currentUser) return null;

      const isLoggedInUser = uid === userData?.userId;

      key = uid;
      image = currentUser.profilePicture;
      title = `${currentUser.firstName} ${currentUser.lastName}`;
      subTitle = currentUser.about;
      itemType = isLoggedInUser ? undefined : DataItemTypeEnum.Link;
      onPress = isLoggedInUser
        ? undefined
        : () => navigation.navigate("Contact", { uid, chatId });
    }

    if (type === "messages") {
      const messageId = itemData.item;
      const messagesForChat = messagesData[chatId];

      if (!messagesForChat) return null;

      const messageData = messagesForChat[messageId];
      const sender = storedUsers[messageData?.sentBy];
      const name = sender && `${sender.firstName} ${sender.lastName}`;

      key = messageId;
      title = name;
      subTitle = messageData.text;
      image = sender.profilePicture;
      itemType = DataItemTypeEnum.StarredMessage;
      onPress = () => {};
    }

    return (
      <DataItem
        key={key}
        title={title!}
        subTitle={subTitle}
        image={image}
        type={itemType}
        onPress={onPress!}
      />
    );
  };

  return (
    <ScreenContainer>
      <FlatList
        data={flatListData}
        keyExtractor={(item) => item}
        renderItem={renderItem}
      />
    </ScreenContainer>
  );
};

export default DataListScreen;
