import React, { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import colors from "../../../shared/constants/colors";
import Icon from "react-native-vector-icons/Ionicons";

interface ChatInputProps {
  onPickImage: () => void;
  onSendMassage: (text: string) => void;
  onTakePhoto: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMassage,
  onPickImage,
  onTakePhoto,
}) => {
  const [messageText, setMessageText] = useState("");

  return (
    <View style={styles.inputContainer}>
      <TouchableOpacity style={styles.button} onPress={onPickImage}>
        <Icon name="add-outline" size={24} color={colors.blue} />
      </TouchableOpacity>
      <TextInput
        placeholder="Message"
        placeholderTextColor={colors.lightGrey}
        value={messageText}
        onChangeText={(text) => setMessageText(text)}
        onSubmitEditing={() => {
          onSendMassage(messageText);
          setMessageText("");
        }}
        style={styles.input}
        multiline
      />
      {messageText && (
        <TouchableOpacity
          style={[styles.button, styles.sendButton]}
          onPress={() => {
            onSendMassage(messageText);
            setMessageText("");
          }}
        >
          <Icon name="send-sharp" size={20} color={"white"} />
        </TouchableOpacity>
      )}
      {!messageText && (
        <TouchableOpacity style={styles.button} onPress={onTakePhoto}>
          <Icon name="camera-outline" size={24} color={colors.blue} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  button: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButton: {
    backgroundColor: colors.blue,
    borderRadius: 18,
    paddingLeft: 4,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: colors.lightGrey,
    padding: 6,
    maxHeight: 100,
    marginHorizontal: 12,
    paddingHorizontal: 12,
  },
});

export default ChatInput;
