import { IdEnum } from "#types";
import {
  validateEmail,
  validateLength,
  validatePasword,
  validateString,
} from "#utils";

export const validateInput = (id: IdEnum, value: string) => {
  if (id === IdEnum.FirstName || id === IdEnum.LastName) {
    return validateString(id, value);
  }
  if (id === IdEnum.Email) {
    return validateEmail(id, value);
  }
  if (id === IdEnum.Password) {
    return validatePasword(id, value);
  }
  if (id === IdEnum.About) {
    return validateLength(id, value, 0, 150, true);
  }
  if (id === IdEnum.ChatName) {
    return validateLength(id, value, 3, 50, false);
  }
  return "";
};
