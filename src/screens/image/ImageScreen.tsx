import React from "react";
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { ImageScreenRouteProp } from "#navigation/types";
import { colors } from "#colors";

const SCREEN_WIDTH = Dimensions.get("screen").width;

const ImageScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<ImageScreenRouteProp>();
  const data = route?.params;

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Icon name={"close-outline"} size={48} color={colors.blue} />
        </TouchableOpacity>
        <Image source={{ uri: data.uri }} style={styles.image} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 56,
    height: 56,
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
  },
});

export default ImageScreen;
