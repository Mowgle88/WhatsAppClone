import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors } from "#colors";
import commonStyles from "#styles";
import { useAppDispatch } from "#store/hooks";
import { authenticate, setDidTryAutoLogin } from "#store/slices";
import { getUserData } from "#utils";

const StartUpScreen = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const tryLogin = async () => {
      const storedAuthInfo = await AsyncStorage.getItem("userData");

      if (!storedAuthInfo) {
        dispatch(setDidTryAutoLogin());
        return;
      }

      const parsedData = JSON.parse(storedAuthInfo);
      const { token, userId, expiryData: expiryDataString } = parsedData;

      const expiryData = new Date(expiryDataString);
      if (expiryData <= new Date() || !token || !userId) {
        dispatch(setDidTryAutoLogin());
        return;
      }

      const userData = await getUserData(userId);
      dispatch(authenticate({ token, userData }));
    };
    tryLogin();
  }, [dispatch]);

  return (
    <View style={commonStyles.center}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
};

export default StartUpScreen;
