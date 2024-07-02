import React from "react";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { colors } from "#colors";
import { CustomHeaderButton } from "#ui";
import { IUserData } from "#types";
import ChatOverflowMenu from "./ChatOverflowMenu";

interface HeaderRightProps {
  onPressSettings: () => void;
  onPressDropdownMenu: (source: number) => void;
  chatId: string;
  userData: IUserData;
}

const HeaderRight: React.FC<HeaderRightProps> = ({
  onPressSettings,
  onPressDropdownMenu,
  chatId,
  userData,
}) => {
  return (
    <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
      {chatId && (
        <Item
          title="Chat settings"
          iconName="settings-outline"
          color={colors.textColor}
          onPress={onPressSettings}
        />
      )}
      <ChatOverflowMenu
        onPress={(source) => onPressDropdownMenu(source)}
        userData={userData}
      />
    </HeaderButtons>
  );
};

export default HeaderRight;
