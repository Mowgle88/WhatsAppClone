import { IdEnum } from "../../types/types";
import {
  validateString,
  validateEmail,
  validatePasword,
  validateLength,
} from "../validationConstraints";

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
    return validateLength(id, value, 0, 10, true);
  }
  return "";
};
