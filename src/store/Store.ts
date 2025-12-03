import { API_TEG_DATA } from "../constants/API_TEG_DATA";
import { STORE_EVENTS } from "../constants/STORE_EVENTS";
import EventBus from "../core/EventBus";
import type { IChat } from "../models/IChat";
import type { IErrorResponse } from "../models/IErrorResponse";
import type { IChatUserResponse, IUser } from "../models/IUser";
import type { StoreEvents } from "../types";
import type { TIndexed } from "../types/TIndexed";
import set from "../utils/set";

type TStore = TIndexed & {
  [API_TEG_DATA.AUTH_STATUS]: boolean;
  [API_TEG_DATA.ERROR]: IErrorResponse | null;
  [API_TEG_DATA.AUTH_USER_INFO]: IUser | null;
  [API_TEG_DATA.CHAT_LIST]: IChat[] | null;
  [API_TEG_DATA.CHAT_TOKEN]: string | null;
  [API_TEG_DATA.CHAT_USER_LIST]: IChatUserResponse[] | null;
};

class Store extends EventBus<StoreEvents> {
  private state: TStore = {
    [API_TEG_DATA.AUTH_STATUS]: false,
    [API_TEG_DATA.ERROR]: null,
    [API_TEG_DATA.AUTH_USER_INFO]: null,
    [API_TEG_DATA.CHAT_LIST]: null,
    [API_TEG_DATA.CHAT_TOKEN]: null,
    [API_TEG_DATA.CHAT_USER_LIST]: null,
  };

  public getState() {
    return this.state;
  }

  public set(path: string, value: unknown) {
    set(this.state, path, value);
    this.emit(STORE_EVENTS.UPDATED);
  }
}

export default new Store();
