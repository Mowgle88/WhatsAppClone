import React from "react";
import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import { IUserData } from "../types/types";
import ProfileImage from "./ProfileImage";
import colors from "../constants/colors";

interface UserDataProps {
  userData: IUserData;
}

const UserDataItem: React.FC<UserDataProps> = ({ userData }) => {
  return (
    <TouchableWithoutFeedback>
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
          <Text style={styles.subtitle}>{userData.about}</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default UserDataItem;

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
});