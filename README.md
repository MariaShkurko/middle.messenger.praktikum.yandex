# SPA Мессенджер

## Ссылки на PR спринтов

- [sprint_1](https://github.com/MariaShkurko/middle.messenger.praktikum.yandex/pull/3)

---

## Описание

Приложение представляет собой веб-мессенджер с базовым функционалом: регистрация, авторизация, отправка сообщений, редактирование профиля и смена пароля.

Проект демонстрирует:
- создание компонентов на Handlebars;
- работу с REST API;
- маршрутизацию без перезагрузки страницы;
- сборку с PostCSS, Vite и TypeScript.

## Дизайн-макет

Figma: https://www.figma.com/design/nyCcHdBKIdxAuihydRQjl2/middle.messenger.praktikum.yandex?node-id=12-35&t=Z2W7xpMcmhpPjDQq-1

---

## Ссылки на сверстанные страницы

| Страница               | Путь               |
|------------------------|--------------------|
| Авторизация            | `https://vite-messenger.netlify.app/login`           |
| Регистрация            | `https://vite-messenger.netlify.app/registration`    |
| Список чатов + чат     | `https://vite-messenger.netlify.app/chats`           |
| Профиль пользователя   | `https://vite-messenger.netlify.app/user-profile`    |
| Редактирование профиля | `https://vite-messenger.netlify.app/edit-user-profile` |
| Смена пароля           | `https://vite-messenger.netlify.app/edit-password`   |
| Ошибка 404             | `https://vite-messenger.netlify.app/404.html`        |
| Ошибка 500             | `https://vite-messenger.netlify.app/500.html`        |

---

## Установка

📦 Веб-адрес приложения: `https://vite-messenger.netlify.app`

> Убедитесь, что у вас установлен Node.js >= 16

```bash
npm install
```

### Запуск проекта:

- `npm run dev` — запуск в режиме разработки (Vite)
- `npm run start` — сборка и запуск production-версии на порту `3000`

---

## 🧰 Технологии и стек

- **TypeScript**
- **Handlebars** — шаблонизатор
- **PostCSS** + плагины:
  - `autoprefixer`
  - `postcss-nested`
  - `postcss-preset-env`
  - `stylelint`
- **Vite** — сборка и dev-сервер

---

## 🧑‍💻 Стандарты разработки

- Настроен Stylelint для `.css`
- Компоненты реализуются в формате: `Component.hbs` + `Component.css`
- Используется БЭМ-нейминг в стилях
