import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import AwesomeAlert from "react-native-awesome-alerts";
import colors from "../../../shared/constants/colors";

interface SendImageModalprops {
  isShowed: boolean;
  isLoading: boolean;
  tempImageUrl: string;
  onCancel: () => void;
  onConfirm: (text: string) => void;
}

const SendImageModal: React.FC<SendImageModalprops> = ({
  isShowed,
  isLoading,
  tempImageUrl,
  onCancel,
  onConfirm,
}) => {
  const [messageText, setMessageText] = useState("");

  return (
    <AwesomeAlert
      show={isShowed}
      title="Send image"
      closeOnTouchOutside={true}
      closeOnHardwareBackPress={false}
      showCancelButton={true}
      showConfirmButton={true}
      cancelText="Cancel"
      confirmText="Send image"
      confirmButtonColor={colors.primary}
      cancelButtonColor={colors.red}
      titleStyle={styles.popupTitle}
      onCancelPressed={onCancel}
      onConfirmPressed={() => onConfirm(messageText)}
      onDismiss={onCancel}
      customView={
        <View>
          {isLoading && (
            <ActivityIndicator size="large" color={colors.primary} />
          )}
          {!isLoading && tempImageUrl && (
            <>
              <Image source={{ uri: tempImageUrl }} style={styles.image} />
              <TextInput
                placeholder="add a description"
                value={messageText}
                onChangeText={(text) => setMessageText(text)}
                style={styles.imageInput}
              />
            </>
          )}
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  popupTitle: {
    fontFamily: "Alkatra-Medium",
    letterSpacing: 0.3,
    color: colors.textColor,
  },
  image: {
    width: 200,
    height: 200,
  },
  imageInput: {
    borderWidth: 1,
    borderColor: colors.lightGrey,
    paddingVertical: Platform.OS === "android" ? 0 : 4,
    marginTop: 16,
    paddingHorizontal: 12,
  },
});

export default SendImageModal;
