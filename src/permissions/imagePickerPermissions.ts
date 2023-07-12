import { Platform } from "react-native";
import { PERMISSIONS, requestMultiple } from "react-native-permissions";

const PERMISSIONS_LIST = Platform.select({
  ios: {
    photoLibrary: [
      PERMISSIONS.IOS.PHOTO_LIBRARY,
      PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY,
    ],
    camera: [PERMISSIONS.IOS.CAMERA],
  },
  android: {
    photoLibrary: [
      PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
    ],
    camera: [PERMISSIONS.ANDROID.CAMERA],
  },
});

const requestPermissions = async (type: "camera" | "photoLibrary") => {
  try {
    const results = await requestMultiple(PERMISSIONS_LIST![type]);
    if (Object.values(results).every((el) => el === "granted")) {
      return true;
    }
    throw new Error("no-permisson");
  } catch (err) {
    throw new Error(err as string);
  }
};

export default requestPermissions;
