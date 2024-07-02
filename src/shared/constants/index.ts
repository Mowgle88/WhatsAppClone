import { IdEnum } from "../types";

export * from "./sources";

export const buttons = [
  {
    id: "gallery",
    icon: "image-outline",
    label: "Select from gallery",
  },
  {
    id: "camera",
    icon: "camera-outline",
    label: "Take new photo",
  },
  {
    id: "remove",
    icon: "trash-outline",
    label: "Remove",
  },
];

const emailInput = {
  id: IdEnum.Email,
  label: "Email",
  placeholder: "Email",
  icon: "mail-outline",
};

const passwordInput = {
  id: IdEnum.Password,
  label: "Password",
  placeholder: "Password",
  icon: "lock-closed-outline",
};

export const signInFormInput = {
  email: emailInput,
  password: passwordInput,
};

const firstAndLastName = {
  firstName: {
    id: IdEnum.FirstName,
    label: "First Name",
    placeholder: "First Name",
    icon: "person-outline",
  },
  lastName: {
    id: IdEnum.LastName,
    label: "Last Name",
    placeholder: "Last Name",
    icon: "person-outline",
  },
};

export const signUpFormInput = {
  ...firstAndLastName,
  ...signInFormInput,
};

export const settingsInput = {
  ...firstAndLastName,
  email: emailInput,
  about: {
    id: IdEnum.About,
    label: "About",
    placeholder: "About",
    icon: "reader-outline",
    autoCapitalize: "none",
    multiline: true,
  },
};
