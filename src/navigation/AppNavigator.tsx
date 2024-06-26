import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import MainNavigator from "./MainNavigator";
import AuthScreen from "../screens/auth/AuthScreen";
import StartUpScreen from "../screens/StartUpScreen";
import { useAppSelector } from "../store/hooks";

const AppNavigator: React.FC = () => {
  const isAuth = useAppSelector((state) => state.auth.token);
  const didTryAutoLogin = useAppSelector((state) => state.auth.didTryAutoLogin);

  return (
    <NavigationContainer>
      {isAuth && <MainNavigator />}
      {!isAuth && didTryAutoLogin && <AuthScreen />}
      {!isAuth && !didTryAutoLogin && <StartUpScreen />}
    </NavigationContainer>
  );
};

export default AppNavigator;
