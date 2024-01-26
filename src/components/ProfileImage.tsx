import React, { useEffect, useRef, useState } from "react";
import RN, {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { Image } from "react-native-image-crop-picker";
import { useDispatch } from "react-redux";
import { ActionSheetRef } from "react-native-actions-sheet";
import colors from "../constants/colors";
import {
  openCamera,
  showImagePicker,
  uploadImageAsync,
} from "../utils/imagePickerHelper";
import { updateSignedInUserData } from "../utils/actions/authActions";
import { updateLoggetInUserData } from "../store/authSlice";
import userImage from "../assets/images/userImage.jpeg";
import { updateChatData } from "../utils/actions/chatActions";
import BottomActionsSheet from "./BottomActionsSheet";

interface ProfileImageProps {
  size: number;
  uri?: string | null;
  userId?: string;
  chatId?: string;
  isShowEditButton?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

const buttons = [
  {
    id: "gallery",
    icon: "image-outline",
    label: "Select from gallery",
  },
  {
    id: "camera",
    icon: "camera-outline",
    label: "Take new photo",
  },
  {
    id: "remove",
    icon: "trash-outline",
    label: "Remove",
  },
];

const ProfileImage: React.FC<ProfileImageProps> = ({
  size,
  uri,
  userId = "",
  chatId,
  isShowEditButton = true,
  onPress,
  style,
}) => {
  const dispatch = useDispatch();
  const source = uri ? { uri: uri } : userImage;

  const [imageUri, setImageUri] = useState(source);
  const [isLoading, setIsLoading] = useState(false);

  const actionSheetRef = useRef<ActionSheetRef>(null);

  const selectAction = async (id: string) => {
    switch (id) {
      case "gallery":
        await onPressChoose();
        break;
      case "camera":
        await onPressNewPhoto();
        break;
      case "remove":
        await onPressDelete();
        break;

      default:
        break;
    }
    actionSheetRef.current?.hide();
  };

  const onPressChoose = async () => {
    await showImagePicker(
      { multiple: false, cropping: true },
      async (image: Image) => {
        if (image.path) {
          setIsLoading(true);

          const uploadUri = await uploadImageAsync(image.path, !!chatId);

          setIsLoading(false);

          if (!uploadUri) {
            throw new Error("could not upload image");
          }

          if (chatId) {
            await updateChatData(chatId, userId, { chatImage: uploadUri });
          } else {
            const newData = { profilePicture: uploadUri };

            await updateSignedInUserData(userId, newData);
            dispatch(updateLoggetInUserData({ newData }));
          }

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

  const onPressDelete = async () => {
    await updateSignedInUserData(userId, { profilePicture: "" });
    dispatch(updateLoggetInUserData({ newData: { profilePicture: "" } }));
    setImageUri(userImage);
  };

  useEffect(() => {
    uri && setImageUri({ uri: uri });
  }, [uri]);

  return (
    <>
      <View style={[styles.container, style]}>
        {isLoading ? (
          <View
            style={[styles.loadingContainer, { width: size, height: size }]}
          >
            <ActivityIndicator size={"small"} color={colors.primary} />
          </View>
        ) : (
          <RN.Image
            source={imageUri}
            style={[styles.image, { width: size, height: size }]}
          />
        )}
        {isShowEditButton && !isLoading && (
          <TouchableOpacity
            onPress={
              onPress ||
              (() => {
                actionSheetRef.current?.show();
              })
            }
            style={[styles.editIcon, onPress && styles.removeIcon]}
          >
            <FontAwesome
              name={onPress ? "remove" : "pencil"}
              size={onPress ? 12 : 16}
              color="black"
            />
          </TouchableOpacity>
        )}
      </View>
      <BottomActionsSheet
        ref={actionSheetRef}
        data={
          imageUri !== userImage
            ? buttons
            : buttons.filter((btn) => btn.id !== "remove")
        }
        onPress={selectAction}
      />
    </>
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
  removeIcon: {
    padding: 2,
  },
});

export default ProfileImage;
