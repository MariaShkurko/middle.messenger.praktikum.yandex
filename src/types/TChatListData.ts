import type { TContact } from "./TContact";
import type { TMessage } from "./TMessage";

export type TChatListDataItem = {
  id: string;
  contact: TContact;
  lastMessage: TMessage;
  unreadCount: number;
};

export type TChatListData = TChatListDataItem[];
