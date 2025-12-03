import { ROUTES } from "./constants/ROUTES";
import { STORE_EVENTS } from "./constants/STORE_EVENTS";
import renderDOM from "./core/renderDOM";
import Router from "./core/router";
import * as Pages from "./pages";
import { AuthController } from "./store/AuthController";
import store from "./store/Store";
import "./style.css";

document.addEventListener("DOMContentLoaded", () => {
  const router = Router.getInstance("#app");
  const authController = new AuthController();

  const isAuthenticated = () => !!store.getState().authUserInfo;

  const initRouter = () => {
    router
      .use(ROUTES.SIGN_IN, Pages.LoginPage)
      .use(ROUTES.SIGN_UP, Pages.RegistrationPage)
      .use(ROUTES.MESSENGER, Pages.ChatsPage, undefined, "div", isAuthenticated)
      .use(ROUTES.SETTINGS, Pages.UserProfilePage, undefined, "div", isAuthenticated)
      .use(ROUTES.EDIT_PASSWORD, Pages.EditPasswordPage, undefined, "div", isAuthenticated);

    router.init();
  };

  const showLoginPage = () => {
    const loginPage = new Pages.LoginPage();
    renderDOM(loginPage, "#app");
  };

  const checkAuthAndRedirect = async () => {
    try {
      await authController.getAuthUserInfo();

      if (!router.isInitialized()) {
        initRouter();
      }

      if (
        isAuthenticated() &&
        (window.location.pathname === ROUTES.SIGN_IN || window.location.pathname === ROUTES.SIGN_UP)
      ) {
        router.go(ROUTES.MESSENGER);
      } else if (!isAuthenticated() && window.location.pathname !== ROUTES.SIGN_IN) {
        router.go(ROUTES.SIGN_IN);
      }
    } catch (e) {
      store.set("error", e);
      showLoginPage();
      if (window.location.pathname !== ROUTES.SIGN_IN) {
        router.go(ROUTES.SIGN_IN);
      }
    }
  };

  void checkAuthAndRedirect();

  window.addEventListener("popstate", () => {
    void (async () => {
      try {
        await checkAuthAndRedirect();
      } catch (error) {
        console.error("Ошибка при обработке popstate:", error);
      }
    })();
  });

  store.on(STORE_EVENTS.UPDATED, () => {
    void (async () => {
      try {
        if (store.getState().authStatus && !router.isInitialized()) {
          await checkAuthAndRedirect();
        }
      } catch (error) {
        console.error("Ошибка при обновлении стора:", error);
      }
    })();
  });
});
