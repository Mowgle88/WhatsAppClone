import { Platform } from "react-native";
import ImagePicker, { Image, Options } from "react-native-image-crop-picker";
import uuid from "react-native-uuid";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import requestPermissions from "../permissions/imagePickerPermissions";
import { getFirebaseApp } from "./firebaseHelper";

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
  onSuccess = async (_source: Image) => {}
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
  onSuccess = async (_source: Image) => {}
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

export const uploadImageAsync = async (
  uri: string,
  isChatImage: boolean = false
) => {
  const app = getFirebaseApp();

  const blob: any = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };

    xhr.onerror = function (e) {
      console.log(e);
      reject(new TypeError("Network request failes"));
    };

    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send();
  });

  const pathFolder = isChatImage ? "chatImages" : "profilePics";
  const storageRef = ref(getStorage(app), `${pathFolder}/${uuid.v4()}`);

  await uploadBytesResumable(storageRef, blob);

  blob.close();

  return await getDownloadURL(storageRef);
};
