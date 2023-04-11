import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

interface PageContainerProps {
  children: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
}

const PageContainer: React.FC<PageContainerProps> = ({
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

export default PageContainer;
