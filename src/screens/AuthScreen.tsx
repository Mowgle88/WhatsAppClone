import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity } from "react-native";
import colors from "../constants/colors";
import PageContainer from "../components/PageContainer";
import SignUpForm from "../components/SignUpForm";
import SignInForm from "../components/SignInForm";

const AuthScreen: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  return (
    <SafeAreaView style={styles.container}>
      <PageContainer>
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
});

export default AuthScreen;
