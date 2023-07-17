import React from "react";
import { HeaderButton } from "react-navigation-header-buttons";
import IonIcon from "react-native-vector-icons/Ionicons";
import colors from "../constants/colors";
import { ColorValue } from "react-native";

interface CustomHeaderButtonProps {
  color?: ColorValue;
}

const CustomHeaderButton: React.FC<CustomHeaderButtonProps> = ({
  color,
  ...props
}) => {
  return (
    <HeaderButton
      IconComponent={IonIcon}
      iconSize={23}
      color={color ?? colors.blue}
      {...props}
    />
  );
};

export default CustomHeaderButton;
