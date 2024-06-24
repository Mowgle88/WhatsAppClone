import React, { useCallback, useReducer, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet } from "react-native";
import IonIcon from "react-native-vector-icons/Ionicons";
import { GoogleSigninButton } from "@react-native-google-signin/google-signin";
import Input from "./Input";
import SubmitButton from "./SubmitButton";
import { validateInput } from "../utils/actions/formActions";
import { State, reducer } from "../utils/redusers/formReducer";
import { IdEnum } from "../types/types";
import { signIn, signInWithGoogle } from "../utils/actions/authActions";
import { useAppDispatch } from "../../store/hooks";
import colors from "../constants/colors";

const initialState: State = {
  inputValues: {
    email: "",
    password: "",
  },
  inputValidities: {
    email: "",
    password: "",
  },
  formIsValid: false,
};

const SignInForm: React.FC = () => {
  const dispatch = useAppDispatch();

  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [isLoading, setIsLoading] = useState(false);

  const inputChangedHandler = useCallback(
    (id: IdEnum, value: string) => {
      const result = validateInput(id, value);
      dispatchFormState({ id, validationResult: result, value });
    },
    [dispatch]
  );

  const authHandler = useCallback(async () => {
    try {
      setIsLoading(true);
      const action = signIn(
        formState.inputValues.email!,
        formState.inputValues.password!
      );
      await dispatch(action);
    } catch (error: any) {
      Alert.alert("An error occurred", error.message);
      setIsLoading(false);
    }
  }, [dispatch, formState]);

  const signinWithGoogleHandler = useCallback(async () => {
    try {
      setIsLoading(true);
      const action = signInWithGoogle();
      await dispatch(action);
    } catch (error: any) {
      Alert.alert("An error occurred", error.message);
      setIsLoading(false);
    }
  }, [dispatch]);

  return (
    <>
      <Input
        id={IdEnum.Email}
        label="Email"
        placeholder="Email"
        icon="mail-outline"
        IconPack={IonIcon}
        autoCapitalize="none"
        keyboardType="email-address"
        onInputChanged={inputChangedHandler}
        errorText={formState.inputValidities.email}
      />
      <Input
        id={IdEnum.Password}
        label="Password"
        placeholder="Password"
        icon="lock-closed-outline"
        IconPack={IonIcon}
        autoCapitalize="none"
        secureTextEntry
        onInputChanged={inputChangedHandler}
        errorText={formState.inputValidities.password}
      />
      {isLoading ? (
        <ActivityIndicator
          size={"small"}
          color={colors.primary}
          style={styles.button}
        />
      ) : (
        <SubmitButton
          title="Sign In"
          onPress={authHandler}
          style={styles.button}
          disabled={!formState.formIsValid}
        />
      )}
      <GoogleSigninButton
        style={styles.googleButton}
        size={GoogleSigninButton.Size.Standard}
        color={GoogleSigninButton.Color.Dark}
        onPress={signinWithGoogleHandler}
      />
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
  },
  googleButton: {
    marginTop: 20,
    alignSelf: "center",
  },
});

export default SignInForm;
