import { StyleSheet, Text, View } from "react-native";
import React from "react";

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
