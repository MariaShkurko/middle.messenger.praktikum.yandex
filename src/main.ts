import { initRouter, navigate } from "./core/navigate.js";
import { isPageKey } from "./core/routes.js";
import "./helpers/handlebarsHelpers.js";
import "./style.css";

document.addEventListener("DOMContentLoaded", () => {
  initRouter();
});
