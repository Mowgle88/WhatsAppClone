import React from "react";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { CustomHeaderButton } from "../../../shared/ui";

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
