import React from "react";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { CustomHeaderButton } from "../../../shared/ui";
import colors from "../../../shared/constants/colors";

interface HeaderRightProps {
  isGroupChat: boolean;
  title: string;
  disabled: boolean;
  onPress: () => void;
}

const HeaderRight: React.FC<HeaderRightProps> = ({
  isGroupChat,
  title,
  disabled,
  onPress,
}) => {
  return (
    <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
      {isGroupChat && (
        <Item
          title={title}
          disabled={disabled}
          color={disabled ? colors.lightGrey : undefined}
          onPress={onPress}
        />
      )}
    </HeaderButtons>
  );
};

export default HeaderRight;
