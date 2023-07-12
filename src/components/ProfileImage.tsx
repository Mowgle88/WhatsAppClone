import React, { useState } from "react";
import RN, { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { Image } from "react-native-image-crop-picker";
import colors from "../constants/colors";
import { openCamera, showImagePicker } from "../utils/imagePickerHelper";

interface ProfileImageProps {
  size: number;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ size }) => {
  const [imageUri, setImageUri] = useState("");

  const onPressChoose = async () => {
    await showImagePicker(
      { multiple: false, cropping: true },
      (image: Image) => {
        if (image.path) {
          setImageUri(image.path);
        }
      }
    );
  };

  const onPressNewPhoto = async () => {
    await openCamera({}, (image: Image) => {
      if (image.path) {
        setImageUri(image.path);
      }
    });
  };

  const renderAlert = () =>
    Alert.alert(
      "Upload Image",
      "Choose an option",
      [
        {
          text: "Upload from gallery",
          onPress: onPressChoose,
        },
        {
          text: "Take new photo",
          onPress: onPressNewPhoto,
        },
        {
          text: "Remove",
          onPress: onPressDelete,
          style: "destructive",
        },
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
      ],
      {
        cancelable: true,
      }
    );

  const onPressDelete = () => {
    setImageUri("");
  };

  return (
    <View style={styles.container}>
      {imageUri ? (
        <RN.Image
          source={{ uri: imageUri }}
          style={[styles.image, { width: size, height: size }]}
        />
      ) : (
        <RN.Image
          source={require("../assets/images/userImage.jpeg")}
          style={[styles.image, { width: size, height: size }]}
        />
      )}
      <TouchableOpacity onPress={renderAlert} style={styles.editIcon}>
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
