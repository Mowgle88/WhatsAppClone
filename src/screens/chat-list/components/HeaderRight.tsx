import React from "react";
import { StyleSheet } from "react-native";
import { CustomHeaderButton } from "../../../shared/ui";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

interface HeaderRightProps {
  onPress: () => void;
}

const HeaderRight: React.FC<HeaderRightProps> = ({ onPress }) => {
  return (
    <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
      <Item
        title="New chat"
        iconName="create-outline"
        style={styles.item}
        onPress={onPress}
      />
    </HeaderButtons>
  );
};

const styles = StyleSheet.create({
  item: {
    marginRight: 16,
  },
});

export default HeaderRight;
