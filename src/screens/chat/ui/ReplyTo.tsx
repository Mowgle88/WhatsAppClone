import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { colors } from "#colors";
import { IUserData } from "#types";

interface ReplyToProps {
  text: string;
  user: IUserData;
  onCancel: () => void;
}

const ReplyTo: React.FC<ReplyToProps> = ({ text, user, onCancel }) => {
  const name = `${user.firstName} ${user.lastName}`;

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text numberOfLines={1} style={styles.name}>
          {name}
        </Text>
        <Text numberOfLines={1}>{text}</Text>
      </View>
      <TouchableOpacity onPress={onCancel}>
        <Icon name="close-circle-outline" size={24} color={colors.blue} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.extraLightGrey,
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 4,
    borderLeftColor: colors.blue,
  },
  textContainer: {
    flex: 1,
    marginRight: 5,
  },
  name: {
    color: colors.blue,
    fontFamily: "Alkatra-Medium",
    letterSpacing: 0.3,
  },
});

export default ReplyTo;
