import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { RootScreenNavigationProps } from "../navigation/types";

const ChatListScreen: React.FC = () => {
  const navigation = useNavigation<RootScreenNavigationProps>();

  return (
    <View style={styles.container}>
      <Text>Chat List Screen</Text>

      <Button
        title="Go to settings"
        onPress={() => {
          navigation.navigate("ChatSettings");
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
