import React, { useState } from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import colors from "../constants/colors";
import PageContainer from "../components/PageContainer";
import SignUpForm from "../components/SignUpForm";
import SignInForm from "../components/SignInForm";

const AuthScreen: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  return (
    <SafeAreaView style={styles.container}>
      <PageContainer>
        <View style={styles.imageContainer}>
          <Image
            source={require("../assets/images/logo.png")}
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
      </PageContainer>
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
});

export default AuthScreen;
