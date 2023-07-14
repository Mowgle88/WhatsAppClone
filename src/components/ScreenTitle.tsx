import React from "react";
import { StyleSheet, Text, View } from "react-native";
import colors from "../constants/colors";

interface ScreenTitleProps {
  text: string;
}

const ScreenTitle: React.FC<ScreenTitleProps> = ({ text }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    alignItems: "center",
  },
  text: {
    fontSize: 28,
    color: colors.textColor,
    fontFamily: "Alkatra-Bold",
    letterSpacing: 0.3,
  },
});

export default ScreenTitle;
