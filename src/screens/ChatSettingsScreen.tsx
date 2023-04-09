import React from "react";
import { StyleSheet, Text, View } from "react-native";

const ChatSettingsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>Chat Settings Screen</Text>
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

export default ChatSettingsScreen;
