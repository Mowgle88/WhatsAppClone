import React from "react";
import { Image, StyleSheet, View } from "react-native";
import colors from "../constants/colors";

interface ProfileImageProps {
  size: number;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ size }) => {
  return (
    <View>
      <Image
        source={require("../assets/images/userImage.jpeg")}
        style={[styles.image, { width: size, height: size }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    borderRadius: 50,
    borderWidth: 2,
    borderColor: colors.grey,
  },
});

export default ProfileImage;
