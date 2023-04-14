export type State = {
  inputValidities: {
    firstName?: boolean;
    lastName?: boolean;
    email: boolean;
    password: boolean;
  };
  formIsValid: boolean;
};

export const reducer = (
  state: State,
  action: { id: string; validationResult: boolean }
) => {
  const { validationResult, id } = action;

  const updatedValidities = {
    ...state.inputValidities,
    [id]: validationResult,
  };

  return {
    ...state,
    inputValidities: updatedValidities,
    formIsValid: !Object.values(updatedValidities).some(Boolean),
  };
};
