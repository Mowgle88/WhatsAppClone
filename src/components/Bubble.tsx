import React from "react";
import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import colors from "../constants/colors";
import { BubbleEnum } from "../types/types";

interface BubbleProps {
  text: string;
  type: BubbleEnum;
}

const Bubble: React.FC<BubbleProps> = ({ text, type }) => {
  const bubbleStyle: ViewStyle = { ...styles.container };
  const textStyle: TextStyle = { ...styles.text };
  const wrapperStyle: ViewStyle = { ...styles.wrapper };

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
      break;
    case BubbleEnum.NotOwnMessage:
      wrapperStyle.justifyContent = "flex-start";
      bubbleStyle.backgroundColor = colors.blue;
      bubbleStyle.maxWidth = "90%";
      break;

    default:
      break;
  }

  return (
    <View style={wrapperStyle}>
      <View style={bubbleStyle}>
        <Text style={textStyle}>{text}</Text>
      </View>
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
});
