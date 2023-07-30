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
  Error = "error",
  OwnMessage = "ownMessage",
  NotOwnMessage = "notOwnMessage",
  Reply = "reply",
}

export interface IObjectData<T> {
  [key: string]: T;
}

export interface IChatData {
  createdAt: string;
  createdBy: string;
  key: string;
  updatedAt: string;
  updatedBy: string;
  users: string[];
  latestMessageText?: string;
}

export interface IChatMessagesData {
  sentAt: string;
  sentBy: string;
  text: string;
  key?: string;
  replyTo?: string;
}

export interface IStarredMessage {
  chatId: string;
  messageId: string;
  starredAt: string;
}
