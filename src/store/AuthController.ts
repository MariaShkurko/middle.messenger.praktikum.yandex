import { AuthAPI, type IAuthDataRequest, type ISignUpRequest } from "../api/auth-api";
import { API_TEG_DATA } from "../constants/API_TEG_DATA";
import type { IErrorResponse } from "../models/IErrorResponse";
import store from "./Store";

export class AuthController {
  private readonly api = new AuthAPI();

  public async signUp(data: ISignUpRequest) {
    try {
      await this.api.signUp(data).then((res) => {
        if (res.success) {
          store.set(API_TEG_DATA.ERROR, null);
        } else {
          throw new Error(res.error?.message || "Неудачная попытка зарегистрироваться");
        }
      });
    } catch (e) {
      store.set(API_TEG_DATA.ERROR, {
        status: 0,
        message: "Неудачная попытка зарегистрироваться",
        details: JSON.stringify(e),
      });
    }
  }
  public async signIn(data: IAuthDataRequest) {
    await this.api.signIn(data).then((res) => {
      if (res.success) {
        store.set(API_TEG_DATA.ERROR, null);
        store.set(API_TEG_DATA.AUTH_STATUS, true);
      } else {
        throw new Error(res.error?.message || "Неудачная попытка входа");
      }
    });
  }
  public async logOut() {
    await this.api
      .logOut()
      .then((res) => {
        if (!res.success) {
          store.set(API_TEG_DATA.ERROR, res.error);
        } else {
          store.set(API_TEG_DATA.AUTH_STATUS, false);
        }
      })
      .catch((e) =>
        store.set(API_TEG_DATA.ERROR, {
          status: 0,
          message: "Неудачная попытка выхода",
          details: JSON.stringify(e),
        }),
      );
  }
  public async getAuthUserInfo() {
    await this.api
      .getAuthUserInfo()
      .then((res) => {
        if (res.success) {
          if (res.data) {
            store.set(API_TEG_DATA.AUTH_USER_INFO, res.data);
          }
        } else {
          if (res.error?.status === 401) {
            throw new Error(res.error?.message || "Неавторизованный пользователь");
          } else {
            throw new Error(res.error?.message || "Не удалось получить данные пользователя");
          }
        }
      })
      .catch((e: IErrorResponse) => {
        store.set(API_TEG_DATA.ERROR, {
          status: e.status || 0,
          message: e.message || "Не удалось получить данные пользователя",
          details: JSON.stringify(e),
        });
        throw e;
      });
  }
}
