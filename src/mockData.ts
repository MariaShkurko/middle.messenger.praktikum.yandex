import camera from "./assets/camera.jpg";

const selectedChat = {
  id: 4,
  name: "Вадим",
  avatar: "",
};

const chats = [
  {
    id: 1,
    name: "Андрей",
    avatar: "",
    lastMessage: "Изображение",
    lastMessageTime: "12:00",
    unreadCount: 20,
  },
  { id: 2, name: "Киноклуб", avatar: "", lastMessage: "Вы: стикер", lastMessageTime: "12:00" },
  {
    id: 3,
    name: "Илья",
    avatar: "",
    lastMessage: "Друзья, у меня для вас...",
    lastMessageTime: "12:00",
    unreadCount: 4,
  },
  { id: 4, name: "Вадим", avatar: "", lastMessage: "Вы: Круто!", lastMessageTime: "12:00" },
  {
    id: 5,
    name: "тет-а-теты",
    avatar: "",
    lastMessage: "И Human Interface Guidelines...",
    lastMessageTime: "12:00",
  },
  {
    id: 6,
    name: "1, 2, 3",
    avatar: "",
    lastMessage: "Миллионы россиян ежедневно...",
    lastMessageTime: "12:00",
  },
  {
    id: 7,
    name: "Design Destroyer",
    avatar: "",
    lastMessage: "В 2008 году художник...",
    lastMessageTime: "12:00",
  },
  {
    id: 8,
    name: "Day.",
    avatar: "",
    lastMessage: "Так увлёкся работой...",
    lastMessageTime: "12:00",
  },
  {
    id: 9,
    name: "Стас Рогозин",
    avatar: "",
    lastMessage: "Можно или сегодня...",
    lastMessageTime: "12:00",
  },
  { id: 10, name: "Project X", avatar: "", lastMessage: "Детали позже", lastMessageTime: "12:00" },
];

const messages = [
  {
    text: "Привет! Смотри, тут всплыл интересный кусок лунной истории...",
    time: "11:56",
    isOwn: false,
  },
  {
    image: camera,
    time: "11:56",
    isOwn: false,
  },
  {
    text: "Круто!",
    time: "12:00",
    isOwn: true,
    read: true,
  },
  {
    text: `Привет! Смотри, тут всплыл интересный кусок лунной космической истории — НАСА в какой-то момент попросила Хассельблад адаптировать модель SWC для полетов на Луну. Сейчас мы все знаем что астронавты летали с моделью 500 EL — и к слову говоря, все тушки этих камер все еще находятся на поверхности Луны, так как астронавты с собой забрали только кассеты с пленкой.

    Хассельблад в итоге адаптировал SWC для космоса, но что-то пошло не так и на ракету они так никогда и не попали. Всего их было произведено 25 штук, одну из них недавно продали на аукционе за 45000 евро.`,
    time: "12:45",
    isOwn: false,
  },
];

export const chatsMockData = {
  chats: chats.map((chat) => ({ ...chat, selected: chat.id === selectedChat.id })),
  selectedChat,
  messages,
};

export const userMockData = {
  display_name: "vadimtop",
  email: "vadim@ya.ru",
  login: "vadim123",
  first_name: "Вадим",
  second_name: "Петров",
  phone: "+79991234567",
};
