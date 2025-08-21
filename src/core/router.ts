import Handlebars from "handlebars";
import renderDOM from "./renderDOM";
import { routes, type TRoutes, isPageKey } from "./routes";

/** Отрисовывает страницу */
export function navigate(page: keyof TRoutes) {
  const [source, context] = routes[page];

  if (typeof source === "function") {
    renderDOM(new source());
  } else {
    const container = document.getElementById("app")!;
    container.innerHTML = Handlebars.compile(source)(context);
  }
}

/** SPA-переход: URL + отрисовка */
export function go(page: keyof TRoutes) {
  window.history.pushState({ page }, "", `/${page}`);
  navigate(page);
}

/** Инициализация маршрутизатора */
export function initRouter() {
  // Загружаем текущую страницу
  const parts = new URL(window.location.href).pathname.split("/").filter(Boolean);
  const page = parts?.length ? parts[0] : "login";

  if (isPageKey(page)) navigate(page);

  // Обработчик кнопок назад/вперёд
  window.addEventListener("popstate", (e) => {
    const statePage = (e.state as { page?: string })?.page;
    if (isPageKey(statePage)) navigate(statePage);
  });

  // Делегирование нажатий по data-page
  document.addEventListener("click", (e) => {
    // обеспечиваем всплытие события до родительского компонента с атрибутом data-page
    // если такой родитель не найден, функция прерывается
    const target = e.target instanceof Element ? e.target.closest("[data-page]") : null;
    const pageAttr = target?.getAttribute("data-page");
    if (isPageKey(pageAttr)) {
      e.preventDefault();
      e.stopImmediatePropagation();
      go(pageAttr);
    }
  });
}
