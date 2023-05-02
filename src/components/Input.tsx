import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { IconProps } from "react-native-vector-icons/Icon";
import colors from "../constants/colors";
import { IdEnum } from "../types/types";

interface InputProps extends TextInputProps {
  IconPack: React.ComponentClass<IconProps, any>;
  icon?: string;
  id: IdEnum;
  label?: string;
  iconSize?: number;
  errorText?: string;
  onInputChanged: (id: IdEnum, value: string) => void;
}

const Input: React.FC<InputProps> = ({
  IconPack,
  icon,
  id,
  label = "",
  iconSize = 24,
  errorText = "",
  onInputChanged = () => {},
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const onChangeText = (text: string) => {
    onInputChanged(id, text);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputInFocus,
          !!errorText && styles.invalidInput,
        ]}
      >
        {icon && <IconPack name={icon} size={iconSize} style={styles.icon} />}
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          onFocus={() => {
            setIsFocused(true);
          }}
          onBlur={() => {
            setIsFocused(false);
          }}
          {...props}
        />
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
    fontFamily: "Alkatra-Bold",
    fontSize: 16,
    letterSpacing: 0.3,
    color: colors.textColor,
  },
  inputContainer: {
    width: "100%",
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: colors.nearlyWhite,
    flexDirection: "row",
    alignItems: "center",
  },
  inputInFocus: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  invalidInput: {
    borderWidth: 2,
    borderColor: colors.red,
  },
  icon: {
    marginRight: 8,
    color: colors.grey,
  },
  input: {
    flex: 1,
    color: colors.textColor,
    padding: 8,
    fontFamily: "Alkatra-Regular",
    fontSize: 16,
  },
  errorContainer: {
    marginVertical: 4,
  },
  errorText: {
    color: colors.red,
    fontSize: 16,
    fontFamily: "Alkatra-Regular",
    letterSpacing: 0.3,
  },
});

export default Input;
