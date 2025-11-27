import {
  UsersAPI,
  type IUpdatePasswordRequest,
  type IUpdateProfileRequest,
} from "../api/users-api";
import type { IErrorResponse } from "../models/IErrorResponse";
import store from "./Store";

const api = new UsersAPI();

export class UserController {
  public async updateProfile(data: IUpdateProfileRequest) {
    await api
      .updateProfile(data)
      .then((res) => {
        if (res.success) {
          store.set("authUserInfo", res.data);
        } else {
          store.set("error", res.error);
        }
      })
      .catch((e: IErrorResponse) => {
        store.set("error", {
          status: e.status || 0,
          message: e.message || "Не удалось обновить данные пользователя",
          details: JSON.stringify(e),
        });
      });
  }
  public async updateAvatar(data: FormData) {
    await api
      .updateAvatar(data)
      .then((res) => {
        if (!res.success) {
          store.set("error", res.error);
        }
      })
      .catch((e: IErrorResponse) => {
        store.set("error", {
          status: e.status || 0,
          message: e.message || "Не удалось обновить данные пользователя",
          details: JSON.stringify(e),
        });
      });
  }
  public async updatePassword(data: IUpdatePasswordRequest) {
    await api
      .updatePassword(data)
      .then((res) => {
        if (!res.success) {
          store.set("error", res.error);
        }
      })
      .catch((e: IErrorResponse) => {
        store.set("error", {
          status: e.status || 0,
          message: e.message || "Не удалось обновить данные пользователя",
          details: JSON.stringify(e),
        });
      });
  }
  public async searchUsers(data: { login: string }) {
    await api
      .searchUsers(data)
      .then((res) => {
        if (res.success) {
          if (res.data) {
            store.set("userList", res.data);
            store.set("error", null);
          } else {
            store.set("error", res.error);
          }
        }
      })
      .catch((e: IErrorResponse) => {
        store.set("error", {
          status: e.status || 0,
          message: e.message || "Не удалось найти пользователя с таким login",
          details: JSON.stringify(e),
        });
      });
  }
}
