import React, { ComponentType } from "react";
import { ColorValue, ViewStyle } from "react-native";
import {
  HeaderButton,
  HeaderButtonProps,
} from "react-navigation-header-buttons";
import IonIcon from "react-native-vector-icons/Ionicons";
import { colors } from "#colors";

type IconComponentType =
  | ComponentType<{
      name: string;
      style?: ViewStyle;
      color?: ColorValue | undefined;
      size?: number | undefined;
    }>
  | undefined;

const CustomHeaderButton: React.FC<HeaderButtonProps> = (props) => {
  return (
    <HeaderButton
      IconComponent={IonIcon as IconComponentType}
      iconSize={23}
      color={props.color ?? colors.blue}
      {...props}
    />
  );
};

export default CustomHeaderButton;
