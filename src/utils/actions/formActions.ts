import { IdEnum } from "../../types/types";
import {
  validateString,
  validateEmail,
  validatePasword,
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
  return "";
};
