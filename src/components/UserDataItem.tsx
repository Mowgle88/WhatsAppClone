import React from "react";
import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { IUserData } from "../types/types";
import ProfileImage from "./ProfileImage";
import colors from "../constants/colors";

interface UserDataProps {
  userData: IUserData;
  lastMessage?: string;
  onPress: () => void;
  type?: string;
  isChecked?: boolean;
}

const UserDataItem: React.FC<UserDataProps> = ({
  userData,
  onPress,
  lastMessage = "",
  type,
  isChecked,
}) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.container}>
        <ProfileImage
          size={48}
          userId={userData.userId}
          uri={userData.profilePicture}
          isShowEditButton={false}
        />
        <View style={styles.textContainer}>
          <Text numberOfLines={1} style={styles.title}>
            {`${userData.firstName} ${userData.lastName}`}
          </Text>
          <Text style={styles.subtitle}>
            {lastMessage ? lastMessage : userData.about}
          </Text>
        </View>
        {type === "checkbox" && (
          <View
            style={[styles.iconContainer, isChecked && styles.checkedStyle]}
          >
            <Ionicons name="checkmark" size={18} color={colors.nearlyWhite} />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomColor: colors.extraLightGrey,
    borderBottomWidth: 1,
    alignItems: "center",
    minHeight: 50,
  },
  textContainer: {
    flex: 1,
    marginLeft: 14,
  },
  title: {
    fontFamily: "Alkatra-Medium",
    fontSize: 16,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontFamily: "Alkatra-Regular",
    color: colors.grey,
    letterSpacing: 0.3,
  },
  iconContainer: {
    borderWidth: 1,
    borderRadius: 50,
    borderColor: colors.lightGrey,
    backgroundColor: colors.nearlyWhite,
  },
  checkedStyle: {
    backgroundColor: colors.primary,
    borderColor: "transparent",
  },
});

export default UserDataItem;
