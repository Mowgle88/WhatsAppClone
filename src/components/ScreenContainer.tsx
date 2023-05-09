import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

interface ScreenContainerProps {
  children: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
}

const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  containerStyle,
}) => {
  return <View style={[styles.container, containerStyle]}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
});

export default ScreenContainer;
