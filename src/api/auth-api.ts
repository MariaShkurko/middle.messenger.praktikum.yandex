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

const APIInstance = new HTTP("/api/v2/auth");

export class AuthAPI extends BaseAPI {
  signUp(data: ISignUpRequest) {
    return APIInstance.post<ISignUpRequest, { id: string }>("/signup", { data });
  }
  signIn(data: IAuthDataRequest) {
    return APIInstance.post<IAuthDataRequest>("/signin", { data });
  }
  logOut() {
    return APIInstance.post("/logout");
  }
  getAuthUserInfo() {
    return APIInstance.get<null, IUser>("/user");
  }
}
