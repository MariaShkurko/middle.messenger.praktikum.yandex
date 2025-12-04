import {
  UsersAPI,
  type IUpdatePasswordRequest,
  type IUpdateProfileRequest,
} from "../api/users-api";
import { API_TEG_DATA } from "../constants/API_TEG_DATA";
import type { IErrorResponse } from "../models/IErrorResponse";
import store from "./Store";

export class UserController {
  private readonly api = new UsersAPI();
  public async updateProfile(data: IUpdateProfileRequest) {
    await this.api
      .updateProfile(data)
      .then((res) => {
        if (res.success) {
          store.set(API_TEG_DATA.AUTH_USER_INFO, res.data);
        } else {
          store.set(API_TEG_DATA.ERROR, res.error);
        }
      })
      .catch((e: IErrorResponse) => {
        store.set(API_TEG_DATA.ERROR, {
          status: e.status || 0,
          message: e.message || "Не удалось обновить данные пользователя",
          details: JSON.stringify(e),
        });
      });
  }
  public async updateAvatar(data: FormData) {
    await this.api
      .updateAvatar(data)
      .then((res) => {
        if (res.success && typeof res.data !== "undefined") {
          store.set(API_TEG_DATA.AUTH_USER_INFO, res.data);
        } else {
          store.set(API_TEG_DATA.ERROR, res.error);
        }
      })
      .catch((e: IErrorResponse) => {
        store.set(API_TEG_DATA.ERROR, {
          status: e.status || 0,
          message: e.message || "Не удалось обновить данные пользователя",
          details: JSON.stringify(e),
        });
      });
  }
  public async updatePassword(data: IUpdatePasswordRequest) {
    await this.api
      .updatePassword(data)
      .then((res) => {
        if (!res.success) {
          store.set(API_TEG_DATA.ERROR, res.error);
        }
      })
      .catch((e: IErrorResponse) => {
        store.set(API_TEG_DATA.ERROR, {
          status: e.status || 0,
          message: e.message || "Не удалось обновить данные пользователя",
          details: JSON.stringify(e),
        });
      });
  }
  public async searchUsers(data: { login: string }) {
    await this.api
      .searchUsers(data)
      .then((res) => {
        if (res.success) {
          if (res.data) {
            store.set(API_TEG_DATA.USER_LIST, res.data);
            store.set(API_TEG_DATA.ERROR, null);
          } else {
            store.set(API_TEG_DATA.ERROR, res.error);
          }
        }
      })
      .catch((e: IErrorResponse) => {
        store.set(API_TEG_DATA.ERROR, {
          status: e.status || 0,
          message: e.message || "Не удалось найти пользователя с таким login",
          details: JSON.stringify(e),
        });
      });
  }
}
