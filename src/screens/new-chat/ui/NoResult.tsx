import React from "react";
import { StyleSheet, Text, View } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { colors } from "#colors";
import commonStyles from "#styles";

interface NoResultProps {
  icon: "users" | "question";
}

const NoResult: React.FC<NoResultProps> = ({ icon }) => {
  return (
    <View style={commonStyles.center}>
      <FontAwesome
        name={icon}
        size={55}
        color={colors.lightGrey}
        style={styles.noResultIcon}
      />
      <Text style={styles.noResultText}>
        {icon === "users"
          ? "Enter a name to search for a user!"
          : "No users found!"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  noResultIcon: {
    marginBottom: 20,
  },
  noResultText: {
    color: colors.textColor,
    fontFamily: "Alkatra-Regular",
    letterSpacing: 0.3,
  },
});

export default NoResult;
