export enum IdEnum {
  FirstName = "firstName",
  LastName = "lastName",
  Email = "email",
  Password = "password",
  About = "about",
}

export interface IUserData {
  firstName: string;
  lastName: string;
  fullName: string;
  about?: string;
  email: string;
  userId: string;
  profilePicture: string;
  signUpDate: string;
}

export interface IUsers {
  [key: string]: IUserData;
}

export enum BubbleEnum {
  System = "system",
  AuthorizedUser = "authorizedUser",
  User = "user",
}

export interface IChatsData {
  [key: string]: IChatData;
}

export interface IChatData {
  createdAt: string;
  createdBy: string;
  key: string;
  updatedAt: string;
  updatedBy: string;
  users: string[];
}
