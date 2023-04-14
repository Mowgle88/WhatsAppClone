import {
  validateString,
  validateEmail,
  validatePasword,
} from "../validationConstraints";

export const validateInput = (id: string, value: string) => {
  if (id === "firstName" || id === "lastName") {
    return validateString(id, value);
  }

  if (id === "email") {
    return validateEmail(id, value);
  }

  if (id === "password") {
    return validatePasword(id, value);
  }
};
