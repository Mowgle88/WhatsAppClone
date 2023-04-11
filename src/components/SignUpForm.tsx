import React from "react";
import { StyleSheet } from "react-native";
import IonIcon from "react-native-vector-icons/Ionicons";
import Input from "./Input";
import SubmitButton from "./SubmitButton";

interface SignUpFormProps {}

const SignUpForm: React.FC<SignUpFormProps> = () => {
  return (
    <>
      <Input label="First Name" icon="person-outline" IconPack={IonIcon} />
      <Input label="Last Name" icon="person-outline" IconPack={IonIcon} />
      <Input label="Email" icon="mail-outline" IconPack={IonIcon} />
      <Input label="Password" icon="lock-closed-outline" IconPack={IonIcon} />
      <SubmitButton title="Sign Up" onPress={() => {}} style={styles.button} />
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
  },
});

export default SignUpForm;
