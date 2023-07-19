import React, { useEffect } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import {
  RootScreenNavigationProps,
  ChatListScreenRouteProp,
} from "../navigation/types";
import CustomHeaderButton from "../components/CustomHeaderButton";
import { useAppSelector } from "../store/hooks";

const ChatListScreen: React.FC = () => {
  const navigation = useNavigation<RootScreenNavigationProps>();
  const route = useRoute<ChatListScreenRouteProp>();
  const selectedUser = route?.params?.selectedUserId;

  const authorizedUserData = useAppSelector((state) => state.auth.userData);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            <Item
              title="New chat"
              iconName="create-outline"
              onPress={() => {
                navigation.navigate("NewChat");
              }}
            />
          </HeaderButtons>
        );
      },
    });
  }, []);

  useEffect(() => {
    if (!selectedUser) {
      return;
    }
    const chatUsers = [selectedUser, authorizedUserData!.userId];

    const navigationProps = {
      newChatData: {
        users: chatUsers,
      },
    };

    navigation.navigate("Chat", navigationProps);
  }, [route?.params]);

  return (
    <View style={styles.container}>
      <Text>Chat List Screen</Text>

      <Button
        title="Go to Chat Screen"
        onPress={() => {
          navigation.navigate("Chat");
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ChatListScreen;
