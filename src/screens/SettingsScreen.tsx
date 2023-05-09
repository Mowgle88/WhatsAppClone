import React, { useCallback, useReducer } from "react";
import IonIcon from "react-native-vector-icons/Ionicons";

import ScreenTitle from "../components/ScreenTitle";
import ScreenContainer from "../components/ScreenContainer";
import Input from "../components/Input";
import { validateInput } from "../utils/actions/formActions";
import { State, reducer } from "../utils/redusers/formReducer";
import { IdEnum } from "../types/types";
import { useAppSelector } from "../store/hooks";

const initialState: State = {
  inputValues: {
    firstName: "",
    lastName: "",
    email: "",
    about: "",
  },
  inputValidities: {
    firstName: "",
    lastName: "",
    email: "",
    about: "",
  },
  formIsValid: false,
};

const SettingsScreen: React.FC = () => {
  const userData = useAppSelector((state) => state.auth.userData);

  const [formState, dispatchFormState] = useReducer(reducer, initialState);

  const inputChangedHandler = useCallback(
    (id: IdEnum, value: string) => {
      const result = validateInput(id, value);
      dispatchFormState({ id, validationResult: result, value });
    },
    [dispatchFormState]
  );

  return (
    <ScreenContainer>
      <ScreenTitle text={"Settings"} />

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
        label="About"
        placeholder="About"
        icon="reader-outline"
        IconPack={IonIcon}
        autoCapitalize="none"
        multiline
        onInputChanged={inputChangedHandler}
        errorText={formState.inputValidities.about}
      />
    </ScreenContainer>
  );
};

export default SettingsScreen;
