import { ImageSourcePropType } from "react-native";
import { IdEnum } from "#types";

export type State = {
  inputValues: {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    about?: string;
    profilePicture?: string;
    chatName?: string;
    chatImageBackground?: ImageSourcePropType;
  };
  inputValidities: {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    about?: string;
    profilePicture?: string;
    chatName?: string;
    chatImageBackground?: ImageSourcePropType;
  };
  formIsValid: boolean;
};

export const reducer = (
  state: State,
  action: { id: IdEnum; validationResult: string; value: string }
) => {
  const { validationResult, id, value } = action;

  const updatedValues = {
    ...state.inputValues,
    [id]: value,
  };

  const updatedValidities = {
    ...state.inputValidities,
    [id]: validationResult,
  };

  let updateFormIsValid = true;
  for (const key in updatedValidities) {
    if (
      updatedValidities[key as keyof State["inputValidities"]] !== undefined
    ) {
      updateFormIsValid = false;
      break;
    }
  }

  return {
    ...state,
    inputValues: updatedValues,
    inputValidities: updatedValidities,
    formIsValid: updateFormIsValid,
  };
};
