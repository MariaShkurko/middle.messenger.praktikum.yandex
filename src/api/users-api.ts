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

const APIInstance = new HTTP("/api/v2/user");

export class UsersAPI extends BaseAPI {
  updateProfile(data: IUpdateProfileRequest) {
    return APIInstance.put<IUpdateProfileRequest, IUser>("/profile", { data });
  }
  updateAvatar(data: FormData) {
    return APIInstance.put<FormData, void>("/profile/avatar", { data });
  }
  updatePassword(data: IUpdatePasswordRequest) {
    return APIInstance.put<IUpdatePasswordRequest, void>("/password", { data });
  }
  searchUsers(data: { login: string }) {
    return APIInstance.post<{ login: string }, IUser[]>("/search", { data });
  }
}
