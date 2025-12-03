import type { IUser } from "../models/IUser";
import HTTP from "../utils/HTTP";
import { BaseAPI } from "./base-api";

export interface ISignUpRequest {
  first_name: string;
  second_name: string;
  login: string;
  email: string;
  password: string;
  phone: string;
}
export interface IAuthDataRequest {
  login: string;
  password: string;
}

export class AuthAPI extends BaseAPI {
  private readonly APIInstance = new HTTP("/api/v2/auth");

  signUp(data: ISignUpRequest) {
    return this.APIInstance.post<ISignUpRequest, { id: string }>("/signup", { data });
  }
  signIn(data: IAuthDataRequest) {
    return this.APIInstance.post<IAuthDataRequest>("/signin", { data });
  }
  logOut() {
    return this.APIInstance.post("/logout");
  }
  getAuthUserInfo() {
    return this.APIInstance.get<null, IUser>("/user");
  }
}
