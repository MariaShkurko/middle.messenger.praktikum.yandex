import type { TWSMessage } from "../constants/WS_TYPE_MESSAGE";

export interface IBaseWebSocketData {
  type: TWSMessage;
  content: string;
}

export interface IWSMessage extends IBaseWebSocketData {
  id: number;
  chat_id?: number;
  user_id: number;
  time: string;
  file?: IWSFile;
}

export interface IWSFile {
  id: number;
  user_id: number;
  path: string;
  filename: string;
  content_type: string;
  content_size: number;
  upload_date: string;
}
