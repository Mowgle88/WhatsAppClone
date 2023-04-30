import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import colors from "../constants/colors";
import commonStyles from "../constants/commonStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { setDidTryAutoLogin } from "../store/authSlice";

const StartUpScreen = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const tryLogin = async () => {
      const storedAuthInfo = await AsyncStorage.getItem("userData");

      if (!storedAuthInfo) {
        dispatch(setDidTryAutoLogin);
        return;
      }

      const parsedData = JSON.parse(storedAuthInfo);
      const { token, userId, expiryData: expiryDataString } = parsedData;
      const expiryData = new Date(expiryDataString);

      if (expiryData <= new Date() || !token || !userId) {
        dispatch(setDidTryAutoLogin);
        return;
      }
    };
    tryLogin();
  }, []);

  return (
    <View style={commonStyles.center}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
};

export default StartUpScreen;
