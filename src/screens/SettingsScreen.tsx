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
import IonIcon from "react-native-vector-icons/Ionicons";
import { ScrollView } from "react-native-gesture-handler";
import ScreenTitle from "../shared/ui/ScreenTitle";
import ScreenContainer from "../shared/ui/ScreenContainer";
import Input from "../shared/components/Input";
import SubmitButton from "../shared/ui/SubmitButton";
import colors from "../shared/constants/colors";
import { validateInput } from "../shared/utils/actions/formActions";
import { State, reducer } from "../shared/utils/redusers/formReducer";
import {
  updateSignedInUserData,
  userLogout,
} from "../shared/utils/actions/authActions";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { updateLoggetInUserData } from "../store/authSlice";
import { IdEnum } from "../shared/types/types";
import ProfileImage from "../shared/components/ProfileImage";
import { ChatScreenNavigationProps } from "../navigation/types";

const SettingsScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.auth.userData);

  const navigation = useNavigation<ChatScreenNavigationProps>();

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

          <Input
            id={IdEnum.FirstName}
            initialValue={userData?.firstName}
            label="First Name"
            placeholder="First Name"
            icon="person-outline"
            IconPack={IonIcon}
            autoCapitalize="none"
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities.firstName}
          />
          <Input
            id={IdEnum.LastName}
            initialValue={userData?.lastName}
            label="Last Name"
            placeholder="Last Name"
            icon="person-outline"
            IconPack={IonIcon}
            autoCapitalize="none"
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities.lastName}
          />
          <Input
            id={IdEnum.Email}
            initialValue={userData?.email}
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
            id={IdEnum.About}
            initialValue={userData?.about}
            label="About"
            placeholder="About"
            icon="reader-outline"
            IconPack={IonIcon}
            autoCapitalize="none"
            multiline
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities.about}
          />
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
