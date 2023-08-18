import React from "react";
import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import ProfileImage from "./ProfileImage";
import colors from "../constants/colors";
import { DataItemTypeEnum } from "../types/types";

interface UserDataProps {
  title: string;
  subTitle?: string;
  image?: string;
  icon?: string;
  onPress: () => void;
  type?: DataItemTypeEnum;
  isChecked?: boolean;
  hideImage?: boolean;
}

const UserDataItem: React.FC<UserDataProps> = ({
  title = "",
  subTitle,
  image,
  icon = "",
  onPress,
  type,
  isChecked,
  hideImage = false,
}) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.container}>
        {!icon && !hideImage && (
          <ProfileImage size={48} uri={image} isShowEditButton={false} />
        )}
        {icon && (
          <View style={styles.leftIconContainer}>
            <Ionicons name={icon} size={20} color={colors.blue} />
          </View>
        )}
        <View style={styles.textContainer}>
          <Text
            numberOfLines={1}
            style={[
              styles.title,
              type === DataItemTypeEnum.Button && styles.buttonTitle,
            ]}
          >
            {title}
          </Text>
          {subTitle && (
            <Text numberOfLines={1} style={styles.subtitle}>
              {subTitle}
            </Text>
          )}
        </View>
        {type === DataItemTypeEnum.Checkbox && (
          <View
            style={[styles.iconContainer, isChecked && styles.checkedStyle]}
          >
            <Ionicons name="checkmark" size={18} color={colors.nearlyWhite} />
          </View>
        )}

        {type === DataItemTypeEnum.Link && (
          <View
            style={[styles.iconContainer, isChecked && styles.checkedStyle]}
          >
            <Ionicons
              name="chevron-forward-outline"
              size={18}
              color={colors.grey}
            />
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
    color: colors.textColor,
  },
  buttonTitle: {
    color: colors.blue,
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
  leftIconContainer: {
    backgroundColor: colors.extraLightGrey,
    borderRadius: 50,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default UserDataItem;
