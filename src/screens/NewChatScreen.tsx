import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useNavigation } from "@react-navigation/native";

import { RootScreenNavigationProps } from "../navigation/types";
import CustomHeaderButton from "../components/CustomHeaderButton";

const NewChatScreen = () => {
  const navigation = useNavigation<RootScreenNavigationProps>();

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => {
        return (
          <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            <Item title="Close" onPress={() => navigation.goBack()} />
          </HeaderButtons>
        );
      },
      headerTitle: "New Chat",
    });
  }, []);

  return (
    <View>
      <Text>NewChatScreen</Text>
    </View>
  );
};

export default NewChatScreen;
