import React, { useCallback, useReducer, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import { ChatScreenNavigationProps } from "#navigation/types";
import { settingsInput } from "#constants";
import { colors } from "#colors";
import { Input, ProfileImage } from "#components";
import { ScreenContainer, ScreenTitle, SubmitButton } from "#ui";
import { useAppDispatch, useAppSelector } from "#store/hooks";
import { updateLoggetInUserData } from "#store/slices";
import { IdEnum } from "#types";
import {
  State,
  reducer,
  updateSignedInUserData,
  userLogout,
  validateInput,
} from "#utils";

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<ChatScreenNavigationProps>();

  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.auth.userData);

  const [isLoading, setIsLoading] = useState(false);
  const [succesMessage, setSuccesMessage] = useState(false);

  const firstName = userData?.firstName || "";
  const lastName = userData?.lastName || "";
  const email = userData?.email || "";
  const about = userData?.about || "";

  const initialState: State = {
    inputValues: {
      firstName,
      lastName,
      email,
      about,
    },
    inputValidities: {
      firstName: undefined,
      lastName: undefined,
      email: undefined,
      about: undefined,
    },
    formIsValid: false,
  };

  const [formState, dispatchFormState] = useReducer(reducer, initialState);

  const inputChangedHandler = useCallback(
    (id: IdEnum, value: string) => {
      const result = validateInput(id, value);
      dispatchFormState({ id, validationResult: result, value });
    },
    [dispatchFormState]
  );

  const saveHandler = useCallback(async () => {
    const updateValues = {
      ...formState.inputValues,
      fullName:
        `${formState.inputValues.firstName} ${formState.inputValues.lastName}`.toLowerCase(),
    };
    try {
      setIsLoading(true);
      await updateSignedInUserData(userData?.userId!, updateValues);
      dispatch(updateLoggetInUserData({ newData: updateValues }));

      setSuccesMessage(true);
      setTimeout(() => {
        setSuccesMessage(false);
      }, 3000);
    } catch (error: any) {
      console.log(error);
      Alert.alert("An error occurred", error.message);
    } finally {
      setIsLoading(false);
    }
  }, [formState, dispatch]);

  const hasChanges = () => {
    const currentValues = formState.inputValues;

    return (
      currentValues.firstName !== firstName ||
      currentValues.lastName !== lastName ||
      currentValues.email !== email ||
      currentValues.about !== about
    );
  };

  return (
    <ScreenContainer>
      <ScreenTitle text={"Settings"} />
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={40}
      >
        <ScrollView contentContainerStyle={styles.formContainer}>
          <ProfileImage
            size={100}
            userId={userData!.userId}
            uri={userData?.profilePicture}
            onNavigate={(uri: string) => {
              navigation.navigate("Image", {
                uri,
              });
            }}
          />
          {Object.entries(settingsInput).map(([key, data]) => (
            <Input
              key={key}
              id={data.id}
              initialValue={userData?.[key as keyof typeof userData] as string}
              label={data.label}
              placeholder={data.placeholder}
              icon={data.icon}
              autoCapitalize="none"
              keyboardType={key === "email" ? "email-address" : "default"}
              multiline={key === "about"}
              onInputChanged={inputChangedHandler}
              errorText={formState.inputValidities[data.id]}
            />
          ))}
          <View style={styles.button}>
            {succesMessage && <Text>Saved!</Text>}
            {isLoading ? (
              <ActivityIndicator
                size={"small"}
                color={colors.primary}
                style={styles.button}
              />
            ) : (
              hasChanges() && (
                <SubmitButton
                  title="Save"
                  onPress={saveHandler}
                  style={styles.button}
                  disabled={!formState.formIsValid}
                />
              )
            )}
          </View>
          <SubmitButton
            title="Logout"
            onPress={() => {
              dispatch(userLogout(userData!.userId));
            }}
            style={styles.button}
            color={colors.red}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    alignItems: "center",
  },
  button: {
    marginTop: 20,
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: "center",
  },
});

export default SettingsScreen;
