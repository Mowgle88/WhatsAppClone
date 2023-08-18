import React, { useEffect } from "react";
import { FlatList } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  RootScreenNavigationProps,
  DataListScreenRouteProp,
} from "../navigation/types";
import ScreenContainer from "../components/ScreenContainer";
import { useAppSelector } from "../store/hooks";
import UserDataItem from "../components/UserDataItem";
import { DataItemTypeEnum } from "../types/types";

const DataListScreen = () => {
  const navigation = useNavigation<RootScreenNavigationProps>();
  const route = useRoute<DataListScreenRouteProp>();

  const storedUsers = useAppSelector((state) => state.users.storedUsers);
  const userData = useAppSelector((state) => state.auth.userData);

  const { title: headerTitle, data, type, chatId } = route?.params;

  console.log(data);

  useEffect(() => {
    navigation.setOptions({
      headerTitle,
    });
  }, [headerTitle]);

  return (
    <ScreenContainer>
      <FlatList
        data={data}
        keyExtractor={(item) => item}
        renderItem={(itemData) => {
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

          return (
            <UserDataItem
              key={key}
              title={title!}
              subTitle={subTitle}
              image={image}
              type={itemType}
              onPress={onPress!}
            />
          );
        }}
      />
    </ScreenContainer>
  );
};

export default DataListScreen;
