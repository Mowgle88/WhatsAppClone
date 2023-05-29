import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import colors from "../constants/colors";

interface ProfileImageProps {
  size: number;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ size }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/userImage.jpeg")}
        style={[styles.image, { width: size, height: size }]}
      />
      <TouchableOpacity onPress={() => {}} style={styles.editIcon}>
        <FontAwesome name="pencil" size={16} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 58,
    borderWidth: 4,
    borderColor: colors.nearlyWhite,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    elevation: 2,
  },
  image: {
    borderRadius: 50,
  },
  editIcon: {
    position: "absolute",
    bottom: -5,
    right: -5,
    padding: 8,
    borderWidth: 2,
    borderColor: colors.nearlyWhite,
    borderRadius: 20,
    backgroundColor: colors.lightGrey,
  },
});

export default ProfileImage;
