import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { IconProps } from "react-native-vector-icons/Icon";
import colors from "../constants/colors";

interface InputProps {
  IconPack: React.ComponentClass<IconProps, any>;
  icon?: string;
  label?: string;
  iconSize?: number;
  errorText?: string;
}

const Input: React.FC<InputProps> = ({
  IconPack,
  icon,
  label = "",
  iconSize = 16,
  errorText = "",
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        {icon && <IconPack name={icon} size={iconSize} style={styles.icon} />}
        <TextInput style={styles.input} />
      </View>
      {errorText && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorText}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  label: {
    marginVertical: 8,
    fontFamily: "Caveat-Bold",
    fontSize: 16,
    letterSpacing: 0.3,
    color: colors.textColor,
  },
  inputContainer: {
    width: "100%",
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderRadius: 4,
    backgroundColor: colors.nearlyWhite,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 8,
    color: colors.grey,
  },
  input: {
    flex: 1,
    color: colors.textColor,
    paddingTop: 0,
    fontFamily: "Caveat-Regular",
  },
  errorContainer: {
    marginVertical: 8,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    fontFamily: "Caveat-Regular",
    letterSpacing: 0.3,
  },
});

export default Input;
