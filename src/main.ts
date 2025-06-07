import Handlebars from "handlebars";
import * as Components from "./components";
import * as Pages from "./pages";
import "./style.css";
import "./helpers/handlebarsHelpers.js";

import arrowIcon from "./assets/arrow-icon.svg?raw";
import searchIcon from "./assets/search-icon.svg?raw";

import { chatsMockData, userMockData } from "./mockData.js";

const pages = {
  login: [Pages.LoginPage],
  registration: [Pages.RegistrationPage],
  chats: [
    Pages.ChatsPage,
    {
      arrowIcon,
      searchIcon,
      showDialog: true,
      data: chatsMockData,
    },
  ],
  "user-profile": [
    Pages.UserProfilePage,
    {
      arrowIcon,
      user: userMockData,
      disableEdit: true,
    },
  ],
  "edit-user-profile": [
    Pages.UserProfilePage,
    {
      arrowIcon,
      user: userMockData,
      disableEdit: false,
    },
  ],
  "edit-password": [
    Pages.EditPasswordPage,
    {
      arrowIcon,
      user: userMockData,
    },
  ],
};

Object.entries(Components).forEach(([name, template]) => {
  Handlebars.registerPartial(name, template);
});

type TPage = typeof pages;

const isPageKey = (key: unknown): key is keyof TPage => typeof key === "string" && key in pages;

function navigate(page: keyof TPage) {
  const [source, context] = pages[page];
  const container = document.getElementById("app")!;

  const templatingFunction = Handlebars.compile(source);
  container.innerHTML = templatingFunction(context);
}

document.addEventListener("DOMContentLoaded", () => {
  const url = new URL(window.location.href);
  const parts = url.pathname.split("/").filter(Boolean);
  const page = parts?.length ? parts[0] : "login";
  if (isPageKey(page)) navigate(page);
});

document.addEventListener("click", (e) => {
  const eventTarget = e.target;
  // обеспечиваем всплытие события до родительского компонента с атрибутом data-page
  // если такой родитель не найден, функция прерывается
  const target = eventTarget instanceof Element ? eventTarget.closest("[data-page]") : null;
  if (!target) return;

  const page = target.getAttribute("data-page");
  if (isPageKey(page)) {
    navigate(page);

    e.preventDefault();
    e.stopImmediatePropagation();
  }
});
