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
    maximum?: number;
    message?: string;
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
  return validationResult?.[id][0];
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

  return validationResult?.[id][0];
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

  const validationResult: {
    [key: string]: string[];
  } = validate({ [id]: value }, { [id]: constraints });

  return validationResult?.[id][0];
};

export const validateLength = (
  id: string,
  value: string,
  minLength: number,
  maxLength: number,
  allowEmpty: boolean
) => {
  const constraints: IConstraints = {
    presence: { allowEmpty },
  };
  if (!allowEmpty || value) {
    constraints.length = {
      minimum: minLength ? minLength : 0,
      maximum: maxLength ? maxLength : 0,
    };
  }

  const validationResult: {
    [key: string]: string[];
  } = validate({ [id]: value }, { [id]: constraints });

  return validationResult?.[id][0];
};
