import React from "react";
import { StyleSheet } from "react-native";
import IonIcon from "react-native-vector-icons/Ionicons";
import Input from "./Input";
import SubmitButton from "./SubmitButton";

interface SignInFormProps {}

const SignInForm: React.FC<SignInFormProps> = () => {
  return (
    <>
      <Input label="Email" icon="mail-outline" IconPack={IonIcon} />
      <Input label="Password" icon="lock-closed-outline" IconPack={IonIcon} />
      <SubmitButton title="Sign In" onPress={() => {}} style={styles.button} />
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
  },
});

export default SignInForm;
