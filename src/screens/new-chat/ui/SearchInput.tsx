import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { colors } from "#colors";

interface SearchProps {
  onChangeText: (text: string) => void;
}

const SearchInput: React.FC<SearchProps> = ({ onChangeText }) => {
  return (
    <View style={styles.searchContainer}>
      <FontAwesome name="search" size={15} color={colors.lightGrey} />
      <TextInput
        placeholder="Search"
        style={styles.searchBox}
        onChangeText={onChangeText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    height: 36,
    marginVertical: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.extraLightGrey,
    borderRadius: 4,
  },
  searchBox: {
    padding: 0,
    marginLeft: 8,
    fontSize: 16,
    width: "100%",
  },
});

export default SearchInput;
