import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image as RNImage,
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { Image } from "react-native-image-crop-picker";
import { useDispatch } from "react-redux";
import { ActionSheetRef } from "react-native-actions-sheet";
import { colors } from "#colors";
import { BottomActionsSheet } from "#components";
import { buttons } from "#constants";
import { updateLoggetInUserData } from "#store/slices";
import {
  openCamera,
  showImagePicker,
  updateChatData,
  updateSignedInUserData,
  uploadImageAsync,
} from "#utils";
import EditButton from "./EditButton";
import userImage from "../../assets/images/userImage.jpeg";

interface ProfileImageProps {
  size: number;
  uri?: string | null;
  userId?: string;
  chatId?: string;
  isShowEditButton?: boolean;
  onPress?: () => void;
  onNavigate?: (userId: string) => void;
  style?: ViewStyle;
}

const ProfileImage: React.FC<ProfileImageProps> = ({
  size,
  uri,
  userId = "",
  chatId,
  isShowEditButton = true,
  onPress,
  onNavigate,
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
          <Pressable
            disabled={!onNavigate}
            onPress={() => {
              if (onNavigate && uri) {
                onNavigate(uri);
              }
            }}
          >
            <RNImage
              source={imageUri}
              style={[styles.image, { width: size, height: size }]}
            />
          </Pressable>
        )}
        {isShowEditButton && !isLoading && (
          <EditButton
            isRemove={!!onPress}
            onPress={
              onPress ||
              (() => {
                actionSheetRef.current?.show();
              })
            }
          />
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
    resizeMode: "contain",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProfileImage;
