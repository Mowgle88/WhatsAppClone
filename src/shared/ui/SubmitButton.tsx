import React from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { colors } from "#colors";

interface SubmitButtonProps {
  disabled?: boolean;
  color?: string;
  title: string;
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  disabled = false,
  color,
  title,
  style,
  onPress = () => {},
}) => {
  const enabledBgColor = color || colors.primary;
  const disabledBgColor = colors.lightGrey;
  const bgColor = disabled ? disabledBgColor : enabledBgColor;

  return (
    <TouchableOpacity
      onPress={disabled ? () => {} : onPress}
      style={[styles.button, { backgroundColor: bgColor }, style]}
    >
      <Text style={[styles.text, disabled && styles.disabledText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 8,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontFamily: "Alkatra-Medium",
    fontSize: 20,
    letterSpacing: 1,
  },
  disabledText: {
    color: colors.grey,
  },
});

export default SubmitButton;
