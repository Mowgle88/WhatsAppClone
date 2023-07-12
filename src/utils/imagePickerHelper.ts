import { Platform } from "react-native";
import ImagePicker, { Image, Options } from "react-native-image-crop-picker";
import requestPermissions from "../permissions/imagePickerPermissions";

const pickerOptions: Options = {
  mediaType: "photo",
  width: 512,
  height: 512,
  cropping: true,
  compressImageMaxWidth: 512,
  compressImageMaxHeight: 512,
  compressImageQuality: Platform.OS === "ios" ? 0.7 : 0.9,
  includeBase64: true,
};

export const showImagePicker = async (
  options = {},
  onSuccess = (_source: Image) => {}
) => {
  try {
    const permission = await requestPermissions("photoLibrary");
    if (permission) {
      const source = await ImagePicker.openPicker({
        ...pickerOptions,
        ...options,
      });
      onSuccess(source);
    }
  } catch (err) {
    throw new Error(err as string);
  }
};

export const openCamera = async (
  options = {},
  onSuccess = (_source: Image) => {}
) => {
  try {
    const permission = await requestPermissions("camera");
    if (permission) {
      const source = await ImagePicker.openCamera({
        ...pickerOptions,
        ...options,
      });
      onSuccess(source);
    }
  } catch (err) {
    throw new Error(err as string);
  }
};
