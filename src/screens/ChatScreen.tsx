import React from "react";
import { ImageBackground, StyleSheet, View } from "react-native";

const ChatScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/images/droplet.jpeg")}
        resizeMode="cover"
        style={styles.backgroundImage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
  },
});

export default ChatScreen;
