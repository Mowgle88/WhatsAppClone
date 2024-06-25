import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { MenuOption } from "react-native-popup-menu";
import { IconProps } from "react-native-vector-icons/Icon";
import Ionicons from "react-native-vector-icons/Ionicons";
import colors from "../constants/colors";

interface MenuItemProps {
  text: string;
  IconPack?: React.ComponentClass<IconProps, any>;
  icon: string;
  onSelect: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({
  text,
  IconPack,
  onSelect,
  icon,
}) => {
  const Icon = IconPack ?? Ionicons;

  return (
    <MenuOption onSelect={onSelect}>
      <View style={styles.menuItemContainer}>
        <Text style={styles.menuText}>{text}</Text>
        <Icon name={icon} size={18} style={styles.icon} />
      </View>
    </MenuOption>
  );
};

const styles = StyleSheet.create({
  menuItemContainer: {
    flexDirection: "row",
    padding: 4,
  },
  menuText: {
    flex: 1,
    fontFamily: "Alkatra-Regular",
    letterSpacing: 0.3,
    fontSize: 16,
  },
  icon: {
    color: colors.blue,
    alignSelf: "center",
  },
});

export default MenuItem;
