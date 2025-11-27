import { AuthAPI, type IAuthDataRequest, type ISignUpRequest } from "../api/auth-api";
import type { IErrorResponse } from "../models/IErrorResponse";
import store from "./Store";

const api = new AuthAPI();

export class AuthController {
  public async signUp(data: ISignUpRequest) {
    try {
      await api.signUp(data).then((res) => {
        if (res.success) {
          store.set("error", null);
        } else {
          throw new Error(res.error?.message || "Неудачная попытка зарегистрироваться");
        }
      });
    } catch (e) {
      store.set("error", {
        status: 0,
        message: "Неудачная попытка зарегистрироваться",
        details: JSON.stringify(e),
      });
    }
  }
  public async signIn(data: IAuthDataRequest) {
    await api.signIn(data).then((res) => {
      if (res.success) {
        store.set("error", null);
        store.set("authStatus", true);
      } else {
        throw new Error(res.error?.message || "Неудачная попытка входа");
      }
    });
  }
  public async logOut() {
    await api
      .logOut()
      .then((res) => {
        if (!res.success) {
          store.set("error", res.error);
        } else {
          store.set("authStatus", false);
        }
      })
      .catch((e) =>
        store.set("error", {
          status: 0,
          message: "Неудачная попытка выхода",
          details: JSON.stringify(e),
        }),
      );
  }
  public async getAuthUserInfo() {
    await api
      .getAuthUserInfo()
      .then((res) => {
        if (res.success) {
          if (res.data) {
            store.set("authUserInfo", res.data);
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
        store.set("error", {
          status: e.status || 0,
          message: e.message || "Не удалось получить данные пользователя",
          details: JSON.stringify(e),
        });
        throw e;
      });
  }
}
