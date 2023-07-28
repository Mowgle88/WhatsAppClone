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
import { useAppSelector } from "../store/hooks";
import { formatAmPm } from "../utils/redusers/dateFormatting";

interface BubbleProps {
  text: string;
  type: BubbleEnum;
  messageId?: string;
  userId?: string;
  chatId?: string;
  date?: string;
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
  date,
}) => {
  const starredMessages = useAppSelector(
    (state) => state.messages.starredMesages[chatId!] ?? {}
  );
  console.log(starredMessages);
  const bubbleStyle: ViewStyle = { ...styles.container };
  const textStyle: TextStyle = { ...styles.text };
  const wrapperStyle: ViewStyle = { ...styles.wrapper };

  const menuRef = useRef<any>(null);
  const id = useRef(uuid.v4());

  let hasMenu = false;
  let isUserMessage = false;
  const dateString = date ? formatAmPm(date) : "";

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
      hasMenu = true;
      isUserMessage = true;
      break;
    case BubbleEnum.NotOwnMessage:
      wrapperStyle.justifyContent = "flex-start";
      bubbleStyle.backgroundColor = colors.nearlyWhite;
      bubbleStyle.maxWidth = "90%";
      hasMenu = true;
      isUserMessage = true;
      break;

    default:
      break;
  }

  const copyToClipboard = async (copiedText: string) => {
    Clipboard.setString(copiedText);
  };

  const isStarred = isUserMessage && starredMessages[messageId!] !== undefined;

  return (
    <View style={wrapperStyle}>
      <TouchableWithoutFeedback
        style={styles.touchable}
        onLongPress={() => {
          if (hasMenu) {
            menuRef.current!.props.ctx.menuActions.openMenu(id.current);
          }
        }}
      >
        <View style={bubbleStyle}>
          <Text style={textStyle}>{text}</Text>
          {dateString && (
            <View style={styles.timeContainer}>
              {isStarred && (
                <Ionicons
                  name="star"
                  size={14}
                  color={colors.textColor}
                  style={styles.star}
                />
              )}
              <Text style={styles.time}>{dateString}</Text>
            </View>
          )}

          <Menu name={id.current as string} ref={menuRef}>
            <MenuTrigger />

            <MenuOptions>
              <MenuItem
                text="Copy to Clipboard"
                icon="copy-outline"
                onSelect={() => copyToClipboard(text)}
              />
              <MenuItem
                text={`${isStarred ? "Unstar" : "Star"} message`}
                icon={isStarred ? "star-outline" : "star"}
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
  timeContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  time: {
    fontFamily: "Caveat-Bold",
    letterSpacing: 0.3,
    color: colors.grey,
    fontSize: 14,
  },
  star: {
    marginHorizontal: 4,
    alignSelf: "center",
  },
});
