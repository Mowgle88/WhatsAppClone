import React, { useCallback, useReducer } from "react";
import { StyleSheet } from "react-native";
import IonIcon from "react-native-vector-icons/Ionicons";
import Input from "./Input";
import SubmitButton from "./SubmitButton";
import { validateInput } from "../utils/actions/formActions";
import { State, reducer } from "../utils/redusers/formReducer";

interface SignInFormProps {}

const initialState: State = {
  inputValidities: {
    email: false,
    password: false,
  },
  formIsValid: false,
};

const SignInForm: React.FC<SignInFormProps> = () => {
  const [formState, dispatch] = useReducer(reducer, initialState);

  const inputChangedHandler = useCallback(
    (id: string, value: string) => {
      const result = validateInput(id, value);
      dispatch({ id, validationResult: !!result });
    },
    [dispatch]
  );
  return (
    <>
      <Input
        id="email"
        label="Email"
        icon="mail-outline"
        IconPack={IonIcon}
        autoCapitalize="none"
        keyboardType="email-address"
        onInputChanged={inputChangedHandler}
      />
      <Input
        id="password"
        label="Password"
        icon="lock-closed-outline"
        IconPack={IonIcon}
        autoCapitalize="none"
        secureTextEntry
        onInputChanged={inputChangedHandler}
      />
      <SubmitButton
        title="Sign In"
        onPress={() => {}}
        style={styles.button}
        disabled={!formState.formIsValid}
      />
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
  },
});

export default SignInForm;
