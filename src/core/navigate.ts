import Handlebars from "handlebars";
import renderDOM from "./renderDOM";
import { isPageKey, routes, type TRoutes } from "./routes";

/**
 * Отрисовывает страницу по ключу
 */
export function navigate(page: keyof TRoutes) {
  const [source, context] = routes[page];

  if (typeof source === "function") {
    renderDOM(new source());
    return;
  }

  const container = document.getElementById("app")!;
  const templatingFunction = Handlebars.compile(source);
  container.innerHTML = templatingFunction(context);
}

/**
 * Переходит на страницу SPA способом
 */
export function go(page: keyof TRoutes) {
  window.history.pushState({ page }, "", `/${page}`);
  navigate(page);
}

/**
 * Инициализация роутера
 */
export function initRouter() {
  // Навигация по текущему URL
  const url = new URL(window.location.href);
  const parts = url.pathname.split("/").filter(Boolean);
  const page = parts?.length ? parts[0] : "login";

  if (isPageKey(page)) {
    navigate(page);
  }

  // Кнопки назад/вперёд
  window.addEventListener("popstate", (e) => {
    const state = e.state as { page?: string } | null;
    const page = state?.page ?? "login";

    if (isPageKey(page)) {
      navigate(page);
    }
  });

  // Делегирование кликов на [data-page]
  document.addEventListener("click", (e) => {
    const eventTarget = e.target;
    // обеспечиваем всплытие события до родительского компонента с атрибутом data-page
    // если такой родитель не найден, функция прерывается
    const target = eventTarget instanceof Element ? eventTarget.closest("[data-page]") : null;
    if (!target) return;

    const page = target.getAttribute("data-page");
    if (isPageKey(page)) {
      go(page);

      e.preventDefault();
      e.stopImmediatePropagation();
    }
  });
}
