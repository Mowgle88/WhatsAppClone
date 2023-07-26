import React, { useRef } from "react";
import {
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
  TouchableWithoutFeedback,
} from "react-native";
import colors from "../constants/colors";
import { BubbleEnum } from "../types/types";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";
import uuid from "react-native-uuid";

interface BubbleProps {
  text: string;
  type: BubbleEnum;
}

const Bubble: React.FC<BubbleProps> = ({ text, type }) => {
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
              <MenuOption text="Option 1" />
              <MenuOption text="Option 2" />
              <MenuOption text="Option 3" />
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
});
