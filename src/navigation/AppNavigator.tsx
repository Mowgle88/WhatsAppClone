import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useAppSelector } from "#store/hooks";
import { AuthScreen, StartUpScreen } from "#screens";
import MainNavigator from "./MainNavigator";

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
