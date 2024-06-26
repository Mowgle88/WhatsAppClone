import React, { useCallback, useReducer, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet } from "react-native";
import { colors } from "#colors";
import { Input } from "#components";
import { signUpFormInput } from "#constants";
import { useAppDispatch } from "#store/hooks";
import { IdEnum } from "#types";
import { SubmitButton } from "#ui";
import { State, reducer, signUp, validateInput } from "#utils";

const initialState: State = {
  inputValues: {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  },
  inputValidities: {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  },
  formIsValid: false,
};

const SignUpForm: React.FC = () => {
  const dispatch = useAppDispatch();

  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [isLoading, setIsLoading] = useState(false);

  const inputChangedHandler = useCallback(
    (id: IdEnum, value: string) => {
      const result = validateInput(id, value);
      dispatchFormState({ id, validationResult: result, value });
    },
    [dispatchFormState]
  );

  const authHandler = useCallback(async () => {
    try {
      setIsLoading(true);
      const action = signUp(
        formState.inputValues.firstName!,
        formState.inputValues.lastName!,
        formState.inputValues.email!,
        formState.inputValues.password!
      );
      await dispatch(action);
    } catch (error: any) {
      Alert.alert("An error occurred", error.message);
      setIsLoading(false);
    }
  }, [dispatch, formState]);

  return (
    <>
      {Object.entries(signUpFormInput).map(([key, data]) => (
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
          title="Sign Up"
          onPress={authHandler}
          style={styles.button}
          disabled={!formState.formIsValid}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
  },
});

export default SignUpForm;
