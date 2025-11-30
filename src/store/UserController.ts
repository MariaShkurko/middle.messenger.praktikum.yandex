import {
  UsersAPI,
  type IUpdatePasswordRequest,
  type IUpdateProfileRequest,
} from "../api/users-api";
import { API_TEG_DATA } from "../constants/API_TEG_DATA";
import type { IErrorResponse } from "../models/IErrorResponse";
import store from "./Store";

const api = new UsersAPI();

export class UserController {
  public async updateProfile(data: IUpdateProfileRequest) {
    await api
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
    await api
      .updateAvatar(data)
      .then((res) => {
        if (res.success && res.data) {
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
    await api
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
    await api
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
