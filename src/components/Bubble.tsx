import React, { useRef } from "react";
import {
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
  TouchableWithoutFeedback,
} from "react-native";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";
import uuid from "react-native-uuid";
import Clipboard from "@react-native-clipboard/clipboard";
import { IconProps } from "react-native-vector-icons/Icon";
import Ionicons from "react-native-vector-icons/Ionicons";
import colors from "../constants/colors";
import { BubbleEnum } from "../types/types";
import { starMessage } from "../utils/actions/chatActions";

interface BubbleProps {
  text: string;
  type: BubbleEnum;
  messageId?: string;
  userId?: string;
  chatId?: string;
}

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

const Bubble: React.FC<BubbleProps> = ({
  text,
  type,
  messageId,
  userId,
  chatId,
}) => {
  const bubbleStyle: ViewStyle = { ...styles.container };
  const textStyle: TextStyle = { ...styles.text };
  const wrapperStyle: ViewStyle = { ...styles.wrapper };

  const menuRef = useRef<any>(null);
  const id = useRef(uuid.v4());

  let hasNenu = false;

  switch (type) {
    case BubbleEnum.System:
      textStyle.color = "#65644A";
      bubbleStyle.backgroundColor = colors.beige;
      bubbleStyle.alignItems = "center";
      bubbleStyle.margin = 10;
      break;
    case BubbleEnum.Error:
      textStyle.color = "white";
      bubbleStyle.backgroundColor = colors.red;
      bubbleStyle.margin = 10;
      break;
    case BubbleEnum.OwnMessage:
      wrapperStyle.justifyContent = "flex-end";
      bubbleStyle.backgroundColor = colors.lightGreen;
      bubbleStyle.maxWidth = "90%";
      hasNenu = true;
      break;
    case BubbleEnum.NotOwnMessage:
      wrapperStyle.justifyContent = "flex-start";
      bubbleStyle.backgroundColor = colors.blue;
      bubbleStyle.maxWidth = "90%";
      hasNenu = true;
      break;

    default:
      break;
  }

  const copyToClipboard = async (copiedText: string) => {
    Clipboard.setString(copiedText);
  };

  return (
    <View style={wrapperStyle}>
      <TouchableWithoutFeedback
        style={styles.touchable}
        onLongPress={() => {
          if (hasNenu) {
            menuRef.current!.props.ctx.menuActions.openMenu(id.current);
          }
        }}
      >
        <View style={bubbleStyle}>
          <Text style={textStyle}>{text}</Text>

          <Menu name={id.current as string} ref={menuRef}>
            <MenuTrigger />

            <MenuOptions>
              <MenuItem
                text="Copy to Clipboard"
                icon="copy-outline"
                onSelect={() => copyToClipboard(text)}
              />
              <MenuItem
                text="Star message"
                icon="star-outline"
                onSelect={() => starMessage(messageId!, chatId!, userId!)}
              />
            </MenuOptions>
          </Menu>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default Bubble;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    justifyContent: "center",
  },
  container: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 6,
    marginBottom: 12,
    borderColor: colors.palebeige,
    borderWidth: 1,
  },
  text: {
    fontFamily: "Alkatra-Regular",
    letterSpacing: 0.3,
  },
  touchable: {
    width: "100%",
  },
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
