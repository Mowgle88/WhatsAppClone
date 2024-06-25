import { IdEnum } from "../types/types";

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

export const signInFormInput = {
  email: {
    id: IdEnum.Email,
    label: "Email",
    placeholder: "Email",
    icon: "mail-outline",
  },
  password: {
    id: IdEnum.Password,
    label: "Password",
    placeholder: "Password",
    icon: "lock-closed-outline",
  },
};

export const signUpFormInput = {
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
  ...signInFormInput,
};

export const settingsInput = {
  ...signInFormInput,
  about: {
    id: IdEnum.About,
    label: "About",
    placeholder: "About",
    icon: "reader-outline",
    autoCapitalize: "none",
    multiline: true,
  },
};
