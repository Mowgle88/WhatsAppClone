import { validate } from "validate.js";

interface IConstraints {
  presence: { allowEmpty: boolean };
  format?: {
    pattern: string;
    flags: string;
    message: string;
  };
  email?: boolean;
  length?: {
    minimum: number;
    message: string;
  };
}

export const validateString = (id: string, value: string) => {
  const constraints: IConstraints = {
    presence: { allowEmpty: false },
  };
  if (value) {
    constraints.format = {
      pattern: "[a-z]+",
      flags: "i",
      message: "Value can only contain letters",
    };
  }

  const validationResult: {
    [key: string]: string[];
  } = validate({ [id]: value }, { [id]: constraints });

  return validationResult && validationResult[id];
};

export const validateEmail = (id: string, value: string) => {
  const constraints: IConstraints = {
    presence: { allowEmpty: false },
  };
  if (value) {
    constraints.email = true;
  }

  const validationResult: {
    [key: string]: string[];
  } = validate({ [id]: value }, { [id]: constraints });

  return validationResult && validationResult[id];
};

export const validatePasword = (id: string, value: string) => {
  const constraints: IConstraints = {
    presence: { allowEmpty: false },
  };
  if (value) {
    constraints.length = {
      minimum: 6,
      message: "must be at least 6 characters",
    };
  }

  const validationResult = validate({ [id]: value }, { [id]: constraints });

  return validationResult && validationResult[id];
};
