import React from "react";
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import colors from "../constants/colors";

interface FloatingButtonProps {
  style?: StyleProp<ViewStyle>;
  icon: string;
  size?: number;
  color?: string;
  position?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
  onPress: () => void;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({
  style,
  icon,
  size = 32,
  color = colors.blue,
  position = {
    bottom: 0,
    right: 0,
  },
  onPress = () => {},
}) => {
  return (
    <TouchableOpacity
      style={[styles.floatingButton, { ...position }, style]}
      onPress={onPress}
    >
      <Icon name={icon} size={size} color={color} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    margin: 16,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default FloatingButton;
