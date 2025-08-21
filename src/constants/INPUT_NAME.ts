export const INPUT_NAME = {
  FIRST_NAME: "first_name",
  SECOND_NAME: "second_name",
  DISPLAY_NAME: "display_name",
  LOGIN: "login",
  EMAIL: "email",
  PASSWORD: "password",
  AGAIN_PASSWORD: "again_password",
  OLD_PASSWORD: "oldPassword",
  NEW_PASSWORD: "newPassword",
  AGAIN_NEW_PASSWORD: "newPasswordAgain",
  PHONE: "phone",
  MESSAGE: "message",
};

export type TInputName = (typeof INPUT_NAME)[keyof typeof INPUT_NAME];
