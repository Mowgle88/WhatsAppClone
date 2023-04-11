import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import MainNavigator from "./MainNavigator";
import AuthScreen from "../screens/AuthScreen";

const AppNavigator: React.FC = () => {
  const isAuth = false;

  return (
    <NavigationContainer>
      {!isAuth && <AuthScreen />}
      {isAuth && <MainNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;
