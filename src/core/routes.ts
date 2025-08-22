import * as Pages from "../pages";

export const routes = {
  login: [Pages.LoginPage],
  registration: [Pages.RegistrationPage],
  chats: [Pages.ChatsPage],
  "user-profile": [Pages.UserProfilePage],
  "edit-password": [Pages.EditPasswordPage],
};

export type TRoutes = typeof routes;

export const isPageKey = (key: unknown): key is keyof TRoutes =>
  typeof key === "string" && key in routes;
