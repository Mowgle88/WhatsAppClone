import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import MainNavigator from "./MainNavigator";
import AuthScreen from "../screens/AuthScreen";
import { useAppSelector } from "../store/hooks";

const AppNavigator: React.FC = () => {
  const isAuth = useAppSelector((state) => state.auth.token);

  return (
    <NavigationContainer>
      {!isAuth && <AuthScreen />}
      {isAuth && <MainNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;
