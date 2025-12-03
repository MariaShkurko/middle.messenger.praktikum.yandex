import type { IUser } from "../models/IUser";
import HTTP from "../utils/HTTP";
import { BaseAPI } from "./base-api";

export interface IUpdateProfileRequest {
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  email: string;
  phone: string;
}

export interface IUpdatePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export class UsersAPI extends BaseAPI {
  private readonly APIInstance = new HTTP("/api/v2/user");

  updateProfile(data: IUpdateProfileRequest) {
    return this.APIInstance.put<IUpdateProfileRequest, IUser>("/profile", { data });
  }
  updateAvatar(data: FormData) {
    return this.APIInstance.put<FormData, void>("/profile/avatar", { data });
  }
  updatePassword(data: IUpdatePasswordRequest) {
    return this.APIInstance.put<IUpdatePasswordRequest, void>("/password", { data });
  }
  searchUsers(data: { login: string }) {
    return this.APIInstance.post<{ login: string }, IUser[]>("/search", { data });
  }
}
