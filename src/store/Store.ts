import { STORE_EVENTS } from "../constants/STORE_EVENTS";
import EventBus from "../core/EventBus";
import type { StoreEvents } from "../types";
import type { TIndexed } from "../types/TIndexed";
import set from "../utils/set";

class Store extends EventBus<StoreEvents> {
  private state: TIndexed = {
    authStatus: false,
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
