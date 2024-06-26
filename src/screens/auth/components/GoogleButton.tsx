import React from "react";
import { Image, Pressable, StyleSheet, Text } from "react-native";
import colors from "../../../shared/constants/colors";
import { google } from "../../../shared/constants/sources";

interface GoogleButtonProps {
  onPress: () => void;
}

const GoogleButton: React.FC<GoogleButtonProps> = ({ onPress }) => {
  const GOOGLE = [
    ["G", "#4285F4"],
    ["o", "#EA4336"],
    ["o", "#FBBC04"],
    ["g", "#4285F4"],
    ["l", "#34A853"],
    ["e", "#EA4336"],
  ];
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <Image style={styles.image} source={google.src} />
      <Text style={styles.buttonText}>
        Sign In with{" "}
        {GOOGLE.map(([letter, color], i) => (
          <Text key={i} style={{ color }}>
            {letter}
          </Text>
        ))}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 260,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    padding: 10,
    // marginTop: 20,
    borderRadius: 25,
    backgroundColor: colors.extraLightGrey,
  },
  pressed: {
    opacity: 0.75,
  },
  image: {
    width: 48,
    height: 48,
    marginRight: 12,
    position: "absolute",
    left: 0,
  },
  buttonText: {
    fontFamily: "Alkatra-Medium",
    fontSize: 18,
    color: colors.blue,
    textAlign: "center",
  },
});

export default GoogleButton;
