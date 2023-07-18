import React, { useState } from "react";
import RN, {
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { Image } from "react-native-image-crop-picker";
import { useDispatch } from "react-redux";
import colors from "../constants/colors";
import {
  openCamera,
  showImagePicker,
  uploadImageAsync,
} from "../utils/imagePickerHelper";
import { updateSignedInUserData } from "../utils/actions/authActions";
import { updateLoggetInUserData } from "../store/authSlice";
import userImage from "../assets/images/userImage.jpeg";

interface ProfileImageProps {
  size: number;
  uri?: string | null;
  userId: string;
  isShowEditButton?: boolean;
}

const ProfileImage: React.FC<ProfileImageProps> = ({
  size,
  uri,
  userId,
  isShowEditButton = true,
}) => {
  const dispatch = useDispatch();
  const source = uri ? { uri: uri } : userImage;

  const [imageUri, setImageUri] = useState(source);
  const [isLoading, setIsLoading] = useState(false);

  const onPressChoose = async () => {
    await showImagePicker(
      { multiple: false, cropping: true },
      async (image: Image) => {
        if (image.path) {
          setIsLoading(true);

          const uploadUri = await uploadImageAsync(image.path);

          setIsLoading(false);

          if (!uploadUri) {
            throw new Error("could not upload image");
          }

          const newData = { profilePicture: uploadUri };

          await updateSignedInUserData(userId, newData);
          dispatch(updateLoggetInUserData({ newData }));

          setImageUri({ uri: uploadUri });
        }
      }
    );
  };

  const onPressNewPhoto = async () => {
    await openCamera({}, async (image: Image) => {
      if (image.path) {
        setIsLoading(true);

        const uploadUri = await uploadImageAsync(image.path);

        setIsLoading(false);

        if (!uploadUri) {
          throw new Error("could not upload image");
        }

        const newData = { profilePicture: uploadUri };

        await updateSignedInUserData(userId, newData);
        dispatch(updateLoggetInUserData({ newData }));

        setImageUri({ uri: uploadUri });
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

  const onPressDelete = async () => {
    await updateSignedInUserData(userId, { profilePicture: "" });
    dispatch(updateLoggetInUserData({ newData: { profilePicture: "" } }));
    setImageUri(userImage);
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={[styles.loadingContainer, { width: size, height: size }]}>
          <ActivityIndicator size={"small"} color={colors.primary} />
        </View>
      ) : (
        <RN.Image
          source={imageUri}
          style={[styles.image, { width: size, height: size }]}
        />
      )}
      {isShowEditButton && !isLoading && (
        <TouchableOpacity onPress={renderAlert} style={styles.editIcon}>
          <FontAwesome name="pencil" size={16} color="black" />
        </TouchableOpacity>
      )}
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
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProfileImage;
