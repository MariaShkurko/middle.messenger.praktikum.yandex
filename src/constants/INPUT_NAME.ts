export const INPUT_NAME = {
  FIRST_NAME: "first_name",
  SECOND_NAME: "second_name",
  LOGIN: "login",
  EMAIL: "email",
  PASSWORD: "password",
  AGAIN_PASSWORD: "again_password",
  PHONE: "phone",
  MESSAGE: "message",
};

export type TInputName = (typeof INPUT_NAME)[keyof typeof INPUT_NAME];
