export const INPUT_NAME = {
  FIRST_NAME: "first_name",
  SECOND_NAME: "second_name",
  LOGIN: "login",
  EMAIL: "email",
  PASSWORD: "password",
  PHONE: "phone",
  MESSAGE: "message",
};

export type T_INPUT_NAME = (typeof INPUT_NAME)[keyof typeof INPUT_NAME];
