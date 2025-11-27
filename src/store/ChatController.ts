import {
  ChatAPI,
  type IAddUsersRequest,
  type IGetChatsRequest,
  type IGetUsersInChatRequest,
} from "../api/chat-api";
import type { IErrorResponse } from "../models/IErrorResponse";
import store from "./Store";

const api = new ChatAPI();

export class ChatController {
  public async getChats(data: IGetChatsRequest) {
    await api
      .getChats(data)
      .then((res) => {
        if (res.success) {
          if (res.data) {
            store.set("chatList", res.data);
          }
        } else {
          if (res.error?.status === 401) {
            throw new Error(res.error?.message || "Неавторизованный пользователь");
          } else {
            throw new Error(res.error?.message || "Не удалось получить чаты");
          }
        }
      })
      .catch((e: IErrorResponse) => {
        store.set("error", {
          status: e.status || 0,
          message: e.message || "Не удалось получить чаты",
          details: JSON.stringify(e),
        });
      });
  }
  public async createChat(data: { title: string; users: number[] }) {
    await api
      .createChat({ title: data.title })
      .then(async (res) => {
        if (res.success) {
          if (res.data?.id) {
            await api.addUsers({ chatId: res.data.id, users: data.users });
          }
        } else {
          store.set("error", res.error);
        }
      })
      .catch((e: IErrorResponse) => {
        store.set("error", `Не удалось создать чат: ${JSON.stringify(e)}`);
      });
  }
  public async addUsers(data: IAddUsersRequest) {
    await api
      .addUsers(data)
      .then((res) => {
        if (!res.success) {
          store.set("error", res.error);
        }
      })
      .catch((e: IErrorResponse) => {
        store.set("error", `Не удалось добавить пользователя в чат: ${JSON.stringify(e)}`);
      });
  }
  public async deleteUsers(data: IAddUsersRequest) {
    await api
      .deleteUsers(data)
      .then((res) => {
        if (!res.success) {
          store.set("error", res.error);
        }
      })
      .catch((e: IErrorResponse) => {
        store.set("error", `Не удалось удалить пользователя из чата: ${JSON.stringify(e)}`);
      });
  }
  public async getToken(chatId: number) {
    store.set("token", null);
    await api
      .getToken(chatId)
      .then((res) => {
        if (res.success && res.data) {
          store.set("token", res.data.token);
        } else {
          store.set("error", res.error ?? "Не удалось подключиться к чату");
        }
      })
      .catch((e: IErrorResponse) => {
        store.set("error", `Не удалось подключиться к чату: ${JSON.stringify(e)}`);
      });
  }
  public async getUnreadMessagesCount(chatId: number) {
    try {
      const res = await api.getUnreadMessagesCount(chatId);

      if (res.success && res.data) {
        return res.data.unread_count;
      } else {
        store.set("error", res.error ?? "Не удалось получить количество непрочитанных сообщений");
        return null;
      }
    } catch (error) {
      store.set(
        "error",
        `Ошибка при получении количества непрочитанных сообщений: ${JSON.stringify(error)}`,
      );
      return null;
    }
  }
  public async getUsersInChat(data: IGetUsersInChatRequest) {
    try {
      const res = await api.getUsersInChat(data);

      if (res.success && res.data?.length) {
        store.set("chatUserList", res.data);
      } else {
        store.set("error", res.error ?? "Не удалось получить список пользователей чата");
        return null;
      }
    } catch (error) {
      store.set(
        "error",
        `Ошибка при получении списка пользователей чата: ${JSON.stringify(error)}`,
      );
      return null;
    }
  }
}
