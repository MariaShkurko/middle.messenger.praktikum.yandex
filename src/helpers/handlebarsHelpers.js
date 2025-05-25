import Handlebars from "handlebars";

Handlebars.registerHelper("default", function (value, defaultValue) {
  return value != null ? value : defaultValue;
});

Handlebars.registerHelper("and", function (a, b) {
  return a && b;
});

Handlebars.registerHelper("or", function (a, b) {
  return a || b;
});

Handlebars.registerHelper("eq", function (a, b) {
  return a === b;
});
