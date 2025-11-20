import { ROUTES } from "./constants/ROUTES";
import Router from "./core/router";
import * as Pages from "./pages";

document.addEventListener("DOMContentLoaded", () => {
  const router = Router.getInstance("#app");

  router
    .use(ROUTES.SIGN_IN, Pages.LoginPage)
    .use(ROUTES.SIGN_UP, Pages.RegistrationPage)
    .use(ROUTES.MESSENGER, Pages.ChatsPage)
    .use(ROUTES.SETTINGS, Pages.UserProfilePage)
    .use(ROUTES.EDIT_PASSWORD, Pages.EditPasswordPage);

  router.init();
});
