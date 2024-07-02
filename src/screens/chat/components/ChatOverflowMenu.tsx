import React from "react";
import { Image, Pressable, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import {
  OverflowMenu,
  overflowMenuPressHandlerDropdownMenu,
} from "react-navigation-header-buttons";
import { colors } from "#colors";
import { backgrounds } from "#constants";
import { IUserData } from "#types";

interface ChatOverflowMenuProps {
  onPress: (source: number) => void;
  userData: IUserData;
}

const ChatOverflowMenu: React.FC<ChatOverflowMenuProps> = ({
  userData,
  onPress,
}) => {
  return (
    <OverflowMenu
      style={styles.dropdownMenu}
      OverflowIcon={() => (
        <Icon name="image-outline" size={23} color={colors.textColor} />
      )}
      onPress={overflowMenuPressHandlerDropdownMenu}
    >
      {Object.values(backgrounds).map((source) => {
        const isActive = source === userData?.chatImageBackground;

        return (
          <Pressable
            style={[styles.dropdownMenuItem, isActive && styles.active]}
            key={source}
            onPress={() => onPress(source)}
          >
            <Image
              source={source}
              resizeMode="cover"
              style={styles.dropdownMenuImage}
            />
          </Pressable>
        );
      })}
    </OverflowMenu>
  );
};

const styles = StyleSheet.create({
  dropdownMenu: {
    marginLeft: 12,
  },
  dropdownMenuItem: {
    margin: 4,
  },
  active: {
    borderColor: colors.blue,
    borderWidth: 2,
  },
  dropdownMenuImage: {
    width: 40,
    height: 60,
    margin: 4,
  },
});

export default ChatOverflowMenu;
