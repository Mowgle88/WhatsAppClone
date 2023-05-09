import React from "react";
import ScreenTitle from "../components/ScreenTitle";
import ScreenContainer from "../components/ScreenContainer";

const SettingsScreen: React.FC = () => {
  return (
    <ScreenContainer>
      <ScreenTitle text={"Settings"} />
    </ScreenContainer>
  );
};

export default SettingsScreen;
