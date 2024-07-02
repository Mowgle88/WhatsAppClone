import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { colors } from "#colors";

interface EditButtonProps {
  isRemove: boolean;
  onPress: () => void;
}

const EditButton: React.FC<EditButtonProps> = ({ isRemove, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.editIcon, isRemove && styles.removeIcon]}
    >
      <FontAwesome
        name={isRemove ? "remove" : "pencil"}
        size={isRemove ? 12 : 16}
        color="black"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  editIcon: {
    position: "absolute",
    bottom: -5,
    right: -5,
    padding: 8,
    borderWidth: 2,
    borderColor: colors.nearlyWhite,
    borderRadius: 20,
    backgroundColor: colors.lightGrey,
  },
  removeIcon: {
    padding: 2,
  },
});

export default EditButton;
