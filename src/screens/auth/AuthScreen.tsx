import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import colors from "../../shared/constants/colors";
import ScreenContainer from "../../shared/ui/ScreenContainer";
import SignUpForm from "./components/SignUpForm";
import SignInForm from "./components/SignInForm";
import { logo } from "../../shared/constants/sources";

const AuthScreen: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  return (
    <SafeAreaView style={styles.container}>
      <ScreenContainer>
        <ScrollView showsVerticalScrollIndicator={false}>
          <KeyboardAvoidingView
            style={styles.keyboardAvoidingView}
            behavior={Platform.OS === "ios" ? "height" : undefined}
            keyboardVerticalOffset={100}
          >
            <View style={styles.imageContainer}>
              <Image
                source={logo.src}
                resizeMode="contain"
                style={styles.image}
              />
            </View>
            {isSignUp ? <SignUpForm /> : <SignInForm />}
            <TouchableOpacity
              onPress={() => setIsSignUp((prevState) => !prevState)}
              style={styles.linkContainer}
            >
              <Text style={styles.link}>{`witch to ${
                isSignUp ? "sign in" : "sign up"
              }`}</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </ScrollView>
      </ScreenContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    marginTop: 20,
  },
  linkContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 16,
  },
  link: {
    color: colors.blue,
    fontFamily: "Caveat-Bold",
    fontSize: 20,
    letterSpacing: 0.3,
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "50%",
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: "center",
  },
});

export default AuthScreen;
