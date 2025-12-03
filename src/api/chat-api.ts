import type { IChat } from "../models/IChat";
import type { IChatUserResponse } from "../models/IUser";
import HTTP from "../utils/HTTP";
import { BaseAPI } from "./base-api";

export interface IGetChatsRequest {
  offset?: number;
  limit?: number;
  title?: string;
}
export interface IAddUsersRequest {
  users: number[];
  chatId: number;
}
export interface IGetUsersInChatRequest {
  chatId: number;
  params?: IGetUsersInChatParams;
}
export interface IGetUsersInChatParams {
  offset?: number;
  limit?: number;
  name?: string;
  email?: string;
}

export class ChatAPI extends BaseAPI {
  private readonly APIInstance = new HTTP("/api/v2/chats");

  getChats(data: IGetChatsRequest) {
    return this.APIInstance.get<IGetChatsRequest, IChat[]>("/", { data });
  }
  createChat(data: { title: string }) {
    return this.APIInstance.post<{ title: string }, { id: number }>("/", { data });
  }
  deleteChat() {
    return this.APIInstance.delete("/");
  }
  addUsers(data: IAddUsersRequest) {
    return this.APIInstance.put<IAddUsersRequest, void>("/users", { data });
  }
  deleteUsers(data: IAddUsersRequest) {
    return this.APIInstance.delete<IAddUsersRequest, void>("/users", { data });
  }
  getToken(chatId: number) {
    return this.APIInstance.post<void, { token: string }>(`/token/${chatId}`);
  }
  getUnreadMessagesCount(chatId: number) {
    return this.APIInstance.get<void, { unread_count: number }>(`/new/${chatId}`);
  }
  getUsersInChat(data: IGetUsersInChatRequest) {
    return this.APIInstance.get<IGetUsersInChatParams, IChatUserResponse[]>(
      `/${data.chatId}/users`,
      {
        data: data.params,
      },
    );
  }
}
