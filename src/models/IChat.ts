import type { IUser } from "./IUser";

export interface IChat {
  id: number;
  title: string;
  avatar: string;
  unread_count: number;
  last_message: IMessage;
}
export interface IMessage {
  user: IUser;
  time: string;
  content: string;
}
