import { CustomHeaderButton } from "#ui";
import React from "react";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

interface HeaderLeftProps {
  onPress: () => void;
}

const HeaderLeft: React.FC<HeaderLeftProps> = ({ onPress }) => {
  return (
    <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
      <Item title="Close" onPress={onPress} />
    </HeaderButtons>
  );
};

export default HeaderLeft;
