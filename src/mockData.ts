import { v4 as makeUUID } from "uuid";
import camera from "./assets/camera.jpg";
import type { TChatListData, TMessage } from "./types";

export const chats: TChatListData = [
  {
    id: makeUUID(),
    contact: {
      id: makeUUID(),
      name: "Андрей",
      avatarUrl: "",
    },
    lastMessage: {
      imageUrl: "https://vheer-nextjs.vercel.app/images/randomSamples/animal/20250212105248.webp",
      dateTime: new Date(2025, 4, 12, 12),
      isOwn: false,
    },
    unreadCount: 20,
  },
  {
    id: makeUUID(),
    contact: {
      id: makeUUID(),
      name: "Киноклуб",
      avatarUrl: "",
    },
    lastMessage: {
      text: "🤔",
      dateTime: new Date(2025, 4, 12, 12),
      isOwn: true,
    },
    unreadCount: 0,
  },
  {
    id: makeUUID(),
    contact: {
      id: makeUUID(),
      name: "Илья",
      avatarUrl: "",
    },
    lastMessage: {
      text: "Друзья, у меня для вас...",
      dateTime: new Date(2025, 4, 12, 12),
      isOwn: false,
    },
    unreadCount: 4,
  },
  {
    id: makeUUID(),
    contact: {
      id: makeUUID(),
      name: "Вадим",
      avatarUrl: "",
    },
    lastMessage: {
      text: "Круто!",
      dateTime: new Date(2025, 4, 12, 12),
      isOwn: true,
    },
    unreadCount: 0,
  },
  {
    id: makeUUID(),
    contact: {
      id: makeUUID(),
      name: "тет-а-теты",
      avatarUrl: "",
    },
    lastMessage: {
      text: "И Human Interface Guidelines...",
      dateTime: new Date(2025, 4, 12, 12),
      isOwn: false,
    },
    unreadCount: 0,
  },
  {
    id: makeUUID(),
    contact: {
      id: makeUUID(),
      name: "1, 2, 3",
      avatarUrl: "",
    },
    lastMessage: {
      text: "Миллионы россиян ежедневно...",
      dateTime: new Date(2025, 4, 12, 12),
      isOwn: false,
    },
    unreadCount: 0,
  },
  {
    id: makeUUID(),
    contact: {
      id: makeUUID(),
      name: "Design Destroyer",
      avatarUrl: "",
    },
    lastMessage: {
      text: "В 2008 году художник...",
      dateTime: new Date(2025, 4, 12, 12),
      isOwn: false,
    },
    unreadCount: 0,
  },
  {
    id: makeUUID(),
    contact: {
      id: makeUUID(),
      name: "Day.",
      avatarUrl: "",
    },
    lastMessage: {
      text: "Так увлёкся работой...",
      dateTime: new Date(2025, 4, 12, 12),
      isOwn: false,
    },
    unreadCount: 0,
  },
  {
    id: makeUUID(),
    contact: {
      id: makeUUID(),
      name: "Стас Рогозин",
      avatarUrl: "",
    },
    lastMessage: {
      text: "Можно или сегодня...",
      dateTime: new Date(2025, 4, 12, 12),
      isOwn: false,
    },
    unreadCount: 0,
  },
  {
    id: makeUUID(),
    contact: {
      id: makeUUID(),
      name: "Project X",
      avatarUrl: "",
    },
    lastMessage: {
      text: "Детали позже",
      dateTime: new Date(2025, 4, 12, 12),
      isOwn: false,
    },
    unreadCount: 0,
  },
];

export const messages: TMessage[] = [
  {
    text: "Привет! Смотри, тут всплыл интересный кусок лунной истории...",
    dateTime: new Date(2025, 4, 12, 11, 56),
    isOwn: false,
  },
  {
    imageUrl: camera,
    dateTime: new Date(2025, 4, 12, 11, 56),
    isOwn: false,
  },
  {
    text: "Круто!",
    dateTime: new Date(2025, 4, 12, 12),
    isOwn: true,
    isRead: true,
  },
  {
    text: `Привет! Смотри, тут всплыл интересный кусок лунной космической истории — НАСА в какой-то момент попросила Хассельблад адаптировать модель SWC для полетов на Луну. Сейчас мы все знаем что астронавты летали с моделью 500 EL — и к слову говоря, все тушки этих камер все еще находятся на поверхности Луны, так как астронавты с собой забрали только кассеты с пленкой.

    Хассельблад в итоге адаптировал SWC для космоса, но что-то пошло не так и на ракету они так никогда и не попали. Всего их было произведено 25 штук, одну из них недавно продали на аукционе за 45000 евро.`,
    dateTime: new Date(2025, 4, 12, 12, 45),
    isOwn: false,
  },
];

export const userMockData = {
  avatarUrl: "",
  display_name: "vadimtop",
  email: "vadim@ya.ru",
  login: "vadim123",
  first_name: "Вадим",
  second_name: "Петров",
  phone: "+79991234567",
};
