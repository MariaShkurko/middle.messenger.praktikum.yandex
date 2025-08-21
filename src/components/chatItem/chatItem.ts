import Block, { type Props } from "../../core/Block";
import type { TChatListDataItem, TMessage } from "../../types";
import { Avatar } from "../avatar";

type TChatItemProps = Props &
  TChatListDataItem & {
    selected: boolean;
  };

export default class ChatItem extends Block<TChatItemProps> {
  constructor(props: TChatItemProps) {
    const formatDate = (inputDate: Date | string) => {
      const today = new Date();
      const input = new Date(inputDate);

      const isSameDay = (d1: Date, d2: Date) =>
        d1.getDate() === d2.getDate() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getFullYear() === d2.getFullYear();

      // Проверка на сегодня
      if (isSameDay(today, input)) {
        return `${String(input.getHours()).padStart(2, "0")}:${String(input.getMinutes()).padStart(2, "0")}`;
      }

      // Определение границ недели (пн-вс)
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - (today.getDay() || 7) + 1);
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      // Проверка на текущую неделю
      if (input >= startOfWeek && input <= endOfWeek) {
        const weekDays = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
        return weekDays[input.getDay()];
      }

      // Форматирование для остальных случаев
      const day = String(input.getDate()).padStart(2, "0");
      const month = String(input.getMonth() + 1).padStart(2, "0");
      const year = input.getFullYear();

      return `${day}.${month}.${year}`;
    };
    const getLastMessageInfo = (message: TMessage): { text: string; time: string } => {
      const res = {
        text: "",
        time: "",
      };

      if (message.imageUrl) {
        res.text = "Изображение";
      } else {
        res.text =
          message.text && message.text.length > 50
            ? message.text?.slice(0, 50) + "..."
            : message.text || "";
      }

      if (message.isOwn) {
        res.text = "Вы: " + res.text;
      }

      if (message.dateTime) {
        res.time = formatDate(message.dateTime);
      }

      return res;
    };

    const { text: lastMessageText, time: lastMessageTime } = getLastMessageInfo(props.lastMessage);
    super("div", {
      ...props,
      className: "chat-item",
      lastMessageText,
      lastMessageTime,
      ContactAvatar: new Avatar({
        className: "chat-item__avatar",
        avatarUrl: props?.contact?.avatarUrl,
        width: "47px",
        height: "47px",
      }),
    });
  }

  protected componentDidUpdate(_oldProps: TChatItemProps, _newProps: TChatItemProps): boolean {
    if (_oldProps.selected !== _newProps.selected) {
      if (_newProps.selected) {
        this.addClassName("chat-item--selected");
      } else {
        this.removeClassName("chat-item--selected");
      }
      return true;
    }
    return false;
  }

  protected render(): string {
    return `
      {{{ ContactAvatar }}}
      <div class="chat-item__info">
        <span class="chat-item__name">{{name}}</span>
        <span class="chat-item__last">{{lastMessageText}}</span>
      </div>
      <div class="chat-item__meta-info">
        <span class="chat-item__time">{{lastMessageTime}}</span>
        <div class="chat-item__badge chat-item__badge--empty">{{unreadCount}}</div>
      </div>
    `;
  }
}
