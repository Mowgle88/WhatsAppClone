import { IdEnum } from "../../types/types";

export type State = {
  inputValidities: {
    firstName?: string;
    lastName?: string;
    email: string;
    password: string;
  };
  formIsValid: boolean;
};

export const reducer = (
  state: State,
  action: { id: IdEnum; validationResult: string }
) => {
  const { validationResult, id } = action;

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
    inputValidities: updatedValidities,
    formIsValid: updateFormIsValid,
  };
};
