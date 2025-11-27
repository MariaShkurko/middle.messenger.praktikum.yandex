export const WS_TYPE_MESSAGE = {
  USER_CONNECTED: "user connected",
  PING: "ping",
  PONG: "pong",
  GET_OLD: "get old",
  MESSAGE: "message",
  FILE: "file",
  STICKER: "sticker",
};

export type TWSMessage = (typeof WS_TYPE_MESSAGE)[keyof typeof WS_TYPE_MESSAGE];
