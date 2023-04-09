import React, { useCallback, useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import colors from "../constants/colors";

const ChatScreen: React.FC = () => {
  const [messageText, setMessageText] = useState("");

  const sendMassage = useCallback(() => {
    setMessageText("");
  }, [messageText]);

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("../assets/images/droplet.jpeg")}
        resizeMode="cover"
        style={styles.backgroundImage}
      />
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.button} onPress={() => {}}>
          <Icon name="add-outline" size={24} color={colors.blue} />
        </TouchableOpacity>
        <TextInput
          value={messageText}
          onChangeText={(text) => setMessageText(text)}
          onSubmitEditing={sendMassage}
          style={styles.input}
        />
        {messageText && (
          <TouchableOpacity
            style={[styles.button, styles.sendButton]}
            onPress={sendMassage}
          >
            <Icon name="send-sharp" size={20} color={"white"} />
          </TouchableOpacity>
        )}
        {!messageText && (
          <TouchableOpacity style={styles.button} onPress={() => {}}>
            <Icon name="camera-outline" size={24} color={colors.blue} />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 10,
    height: 50,
  },
  button: {
    width: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButton: {
    backgroundColor: colors.blue,
    borderRadius: 50,
    paddingLeft: 4,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 50,
    borderColor: colors.lightGrey,
    marginHorizontal: 16,
    paddingHorizontal: 12,
  },
});

export default ChatScreen;
