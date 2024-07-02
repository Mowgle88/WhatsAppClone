import React, { ForwardedRef, forwardRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import Ionicons from "react-native-vector-icons/Ionicons";
import { colors } from "#colors";

interface BottomActionsSheetProps {
  data: ButtonProps[];
  onPress: (action: string) => void;
}

interface ButtonProps {
  id: string;
  icon: string;
  label: string;
}

const BottomActionsSheet = forwardRef<ActionSheetRef, BottomActionsSheetProps>(
  ({ data, onPress }, ref: ForwardedRef<ActionSheetRef>) => {
    return (
      <ActionSheet
        ref={ref}
        useBottomSafeAreaPadding
        containerStyle={styles.container}
      >
        <View>
          {data.map(({ id, icon, label }) => (
            <TouchableOpacity
              key={id}
              onPress={() => {
                onPress(id);
              }}
              style={styles.buttonContainer}
            >
              <Ionicons
                name={icon}
                size={24}
                color={colors.primary}
                style={styles.icon}
              />
              <Text style={styles.label}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ActionSheet>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    padding: 32,
  },
  buttonContainer: {
    flexDirection: "row",
    marginVertical: 12,
    alignItems: "center",
  },
  icon: {
    marginHorizontal: 8,
  },
  label: {
    color: colors.blue,
    fontSize: 16,
  },
});

export default BottomActionsSheet;
