import React, { useEffect } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { RootScreenNavigationProps } from "../navigation/types";
import CustomHeaderButton from "../components/CustomHeaderButton";

const ChatListScreen: React.FC = () => {
  const navigation = useNavigation<RootScreenNavigationProps>();

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

  return (
    <View style={styles.container}>
      <Text>Chat List Screen</Text>

      <Button
        title="Go to Chat Screen"
        onPress={() => {
          navigation.navigate("ChatScreen");
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
