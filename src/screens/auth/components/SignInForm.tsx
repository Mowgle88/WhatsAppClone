import React, { useCallback, useReducer, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text } from "react-native";
import Input from "../../../shared/components/Input";
import SubmitButton from "../../../shared/ui/SubmitButton";
import { validateInput } from "../../../shared/utils/actions/formActions";
import { State, reducer } from "../../../shared/utils/redusers/formReducer";
import { IdEnum } from "../../../shared/types/types";
import {
  signIn,
  signInWithGoogle,
} from "../../../shared/utils/actions/authActions";
import { useAppDispatch } from "../../../store/hooks";
import colors from "../../../shared/constants/colors";
import { signInFormInput } from "../../../shared/constants";
import GoogleButton from "./GoogleButton";

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
      {Object.entries(signInFormInput).map(([key, data]) => (
        <Input
          key={key}
          id={data.id}
          label={data.label}
          placeholder={data.placeholder}
          icon={data.icon}
          autoCapitalize="none"
          keyboardType={key === "email" ? "email-address" : "default"}
          secureTextEntry={key === "password"}
          onInputChanged={inputChangedHandler}
          errorText={formState.inputValidities[data.id]}
        />
      ))}
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
      <Text style={styles.text}>Or continue</Text>
      <GoogleButton onPress={signinWithGoogleHandler} />
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
  text: {
    color: colors.blue,
    fontFamily: "Alkatra-Medium",
    fontSize: 18,
    letterSpacing: 0.3,
    marginTop: 24,
    alignSelf: "center",
  },
});

export default SignInForm;
