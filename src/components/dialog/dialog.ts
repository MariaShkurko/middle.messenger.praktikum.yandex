import { Avatar, Button, Input, MenuButton, Message, Modal } from "..";
import arrowIcon from "../../assets/arrow-icon.svg?raw";
import { INPUT_NAME } from "../../constants/INPUT_NAME";
import { WS_TYPE_MESSAGE } from "../../constants/WS_TYPE_MESSAGE";
import Block, { type Props } from "../../core/Block";
import type { IChat } from "../../models/IChat";
import type { IErrorResponse } from "../../models/IErrorResponse";
import type { IUser } from "../../models/IUser";
import type { IWSMessage } from "../../models/IWebSocket";
import { ChatController } from "../../store/ChatController";
import store from "../../store/Store";
import { connect } from "../../utils/connect";
import isEqual from "../../utils/isEqual";
import { validateInput } from "../../utils/validateForm";
import AddUserForm from "./AddUserForm";
import DeleteUserForm from "./DeleteUserForm";
import HideMenu from "./HideMenu";

type TDialogProps = Props & {
  showDialog: boolean;
  selectedChatId: number | null;
  chatList: IChat[] | null;
  token: string | null;
  userId: number | null;
  errorWS: IErrorResponse | null;
  inputValue?: string;
  inputError?: string;
};

const HOST_WS = "wss://ya-praktikum.tech";

const controller = new ChatController();

class Dialog extends Block<TDialogProps> {
  private ws: WebSocket | null = null;
  private pingInterval: number | null = null;
  private chatInfo: IChat | null = null;

  constructor(tagName: string = "div", props: TDialogProps) {
    const showMenu: boolean = false;
    const inputValue = "";
    const inputError = "";

    const AddUserFormComponent = new AddUserForm("form", {
      userLogin: "",
      error: null,
      selectedChatId: props.selectedChatId,
      userList: null,
      selectedUser: null,
      onCloseModal: () => {
        if (!Array.isArray(this.children.ModalAddUser)) {
          this.children.ModalAddUser.setProps({ active: false });
        }
      },
    });
    const ModalAddUser = new Modal({
      id: "add-modal",
      active: false,
      content: AddUserFormComponent,
    });
    const DeleteUserFormComponent = new DeleteUserForm("form", {
      error: null,
      userList: null,
      selectedChatId: props.selectedChatId,
      selectedUser: null,
      onCloseModal: () => {
        if (!Array.isArray(this.children.ModalDeleteUser)) {
          this.children.ModalDeleteUser.setProps({ active: false });
        }
      },
    });
    const ModalDeleteUser = new Modal({
      id: "delete-modal",
      active: false,
      content: DeleteUserFormComponent,
    });

    super(tagName, {
      ...props,
      showMenu,
      inputError,
      inputValue,
      className: `feed${!props.showDialog ? " feed--empty" : ""}`,
      ModalAddUser,
      ModalDeleteUser,
    });

    this.children.ContactAvatar = new Avatar({
      width: "34px",
      height: "34px",
      avatarUrl: this.chatInfo?.avatar,
    });
    this.children.MenuButton = new MenuButton({
      onClick: (_e: Event) => {
        _e.preventDefault();
        this.setProps({
          showMenu: !this.props.showMenu,
        });
      },
    });
    this.children.HideMenu = new HideMenu({
      showMenu,
      onAddUser: (e: Event) => {
        e.preventDefault();
        if (!Array.isArray(this.children.ModalAddUser)) {
          this.children.ModalAddUser.setProps({ active: true });
        }
        this.setProps({ showMenu: false });
      },
      onDeleteUser: (e: Event) => {
        e.preventDefault();
        if (!Array.isArray(this.children.ModalDeleteUser)) {
          this.children.ModalDeleteUser.setProps({ active: true });
        }
        this.setProps({ showMenu: false });
      },
    });
    this.children.InputMessage = new Input({
      id: INPUT_NAME.MESSAGE,
      formId: "new-message",
      label: "Сообщение",
      value: this.props.inputValue ?? "",
      errorMessage: this.props.inputError,
      variant: "outlined",
      className: "feed__input",
      onChange: (e) => {
        const target = e.target as HTMLInputElement;
        this.setProps({ inputValue: target.value });
      },
      onBlur: (e) => {
        const target = e.target as HTMLInputElement;
        this.setProps({ inputError: validateInput(INPUT_NAME.MESSAGE, target.value) });
      },
    });
    this.children.SendButton = new Button({
      variant: "icon",
      type: "submit",
      icon: arrowIcon,
      onClick: (e) => {
        e.preventDefault();
        const error = validateInput(INPUT_NAME.MESSAGE, this.props.inputValue ?? "");

        if (!error && this.props.inputValue) {
          if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(
              JSON.stringify({
                content: this.props.inputValue,
                type: WS_TYPE_MESSAGE.MESSAGE,
              }),
            );
            this.addSentMessageToUI(this.props.inputValue);
            this.setProps({ inputValue: "" });
          } else {
            store.set("error", { message: "Нет соединения с чатом" });
          }
        }

        this.dispatchComponentDidUpdate();
      },
    });
  }

  private async getToken() {
    try {
      if (this.props.selectedChatId) {
        await controller.getToken(this.props.selectedChatId);
      }
    } catch (error) {
      console.error("Ошибка подключения к чату:", error);
      store.set("error", { message: "Не удалось подключиться к чату" });
    }
  }

  private async loadChatMessages() {
    try {
      if (!this.props.selectedChatId) {
        throw Error("Не найден id чата");
      }
      const unreadCount = await controller.getUnreadMessagesCount(this.props.selectedChatId);
      let offset = 0;
      const messages: IWSMessage[] = [];
      if (unreadCount) {
        while (offset < unreadCount) {
          await this.fetchMessagesBatch(offset, messages);
          offset += 20;
        }
      } else {
        await this.fetchMessagesBatch(offset, messages);
      }

      this.displayMessages(
        messages.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()),
      );
    } catch (error) {
      console.error("Ошибка при загрузке сообщений чата:", error);
      store.set("error", { message: "Не удалось загрузить сообщения чата" });
    }
  }

  private async fetchMessagesBatch(offset: number, messages: IWSMessage[]) {
    return new Promise<void>((resolve) => {
      if (this.ws && this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(
          JSON.stringify({
            content: offset.toString(),
            type: WS_TYPE_MESSAGE.GET_OLD,
          }),
        );

        const messageHandler = (event: MessageEvent) => {
          const data = JSON.parse(event.data as string) as IWSMessage[];
          messages.push(...data);
          this.ws?.removeEventListener("message", messageHandler);
          resolve();
        };

        this.ws.addEventListener("message", messageHandler);
      }
    });
  }

  private wsController() {
    this.closeWebSocket();

    if (!this.props.userId || !this.props.selectedChatId || !this.props.token) {
      return;
    }

    try {
      this.ws = new WebSocket(
        `${HOST_WS}/ws/chats/${this.props.userId}/${this.props.selectedChatId}/${this.props.token}`,
      );

      this.setupWebSocketEvents();
    } catch (error) {
      console.error("Ошибка создания WebSocket:", error);
      store.set("errorWS", { message: "Не удалось установить соединение" });
    }
  }

  private setupWebSocketEvents() {
    if (!this.ws) return;

    this.ws.addEventListener("open", () => {
      store.set("errorWS", null);
      void this.loadChatMessages();
    });

    this.ws.addEventListener("message", (event) => {
      try {
        const data = JSON.parse(event.data as string) as unknown as IWSMessage;
        if (!Array.isArray(data) && data.type !== WS_TYPE_MESSAGE.PONG) {
          this.handleMessage(data);
        }
      } catch (err) {
        console.error("Ошибка парсинга сообщения:", err);
      }
    });

    this.ws.addEventListener("close", (event) => {
      if (event.wasClean) {
        store.set("errorWS", null);
      } else {
        store.set("errorWS", { message: `Обрыв соединения: ${event.reason}` });
      }
    });

    this.ws.addEventListener("error", (event) => {
      console.error("Ошибка WebSocket:", event);
      store.set("errorWS", { message: "Ошибка соединения", details: JSON.stringify(event) });
    });
  }

  private sendPing() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: WS_TYPE_MESSAGE.PING }));
    } else {
      console.warn("WebSocket not connected, cannot send ping");
      store.set("errorWS", { message: "Ошибка соединения" });
    }
  }

  private closeWebSocket() {
    if (this.ws) {
      this.ws.close(1000, "Закрытие соединения");
      this.ws = null;
    }
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  private handleMessage(data: IWSMessage) {
    if (data.type === WS_TYPE_MESSAGE.FILE) {
      console.warn("Функция получения файлов не предоставляется в MVP0");
      return;
    }

    if (data.type !== WS_TYPE_MESSAGE.MESSAGE) {
      console.warn("Некорректный тип сообщения:", data.type);
      return;
    }

    if (!data.id || !data.time || !data.user_id || !data.content) {
      console.error("Сообщение не содержит обязательных полей:", data);
      return;
    }

    if (data.user_id !== this.props.userId && data.chat_id === this.props.selectedChatId) {
      const messageComponent = new Message({ ...data });

      if (Array.isArray(this.children.messageComponents)) {
        this.children.messageComponents.push(messageComponent);
      } else {
        this.children.messageComponents = [messageComponent];
      }
      this.dispatchComponentDidUpdate();
      this.scrollToBottom();
    }
  }

  private scrollToBottom() {
    const chatContainer = this.getContent()?.querySelector(".feed__main");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }

  private addSentMessageToUI(content: string) {
    if (!this.props.userId) return;

    const sentMessage: IWSMessage = {
      id: Date.now(),
      time: new Date().toISOString(),
      user_id: this.props.userId,
      content: content,
      type: WS_TYPE_MESSAGE.MESSAGE,
    };

    const messageComponent = new Message({ ...sentMessage });

    if (Array.isArray(this.children.messageComponents)) {
      this.children.messageComponents.push(messageComponent);
    } else {
      this.children.messageComponents = [messageComponent];
    }

    this.scrollToBottom();
    this.dispatchComponentDidUpdate();
  }

  private displayMessages(messages: IWSMessage[]) {
    messages.forEach((message) => {
      if (message.chat_id === this.props.selectedChatId) {
        const messageComponent = new Message({ ...message });
        if (Array.isArray(this.children.messageComponents)) {
          this.children.messageComponents.push(messageComponent);
        } else {
          this.children.messageComponents = [messageComponent];
        }
      }
    });
    this.dispatchComponentDidUpdate();
    this.scrollToBottom();
  }

  protected componentDidMount() {
    this.wsController();
    this.pingInterval = setInterval(() => this.sendPing(), 30000);
  }

  protected componentDidUpdate(oldProps: TDialogProps, newProps: TDialogProps): boolean {
    // поддержка dispatchComponentDidUpdate - это единственный вариант, когда пропсы пустые
    if (oldProps === undefined && newProps === undefined) return true;
    if (!oldProps || !newProps) return false; // защита от недоступных значений на остальных проверках

    if (oldProps.selectedChatId !== newProps.selectedChatId) {
      if (!newProps.selectedChatId) {
        store.set("token", null);
      } else {
        void this.getToken();
        this.children.messageComponents = [];
      }
      this.setProps({ showDialog: !!newProps.selectedChatId, showMenu: false });

      if (newProps.selectedChatId) {
        this.removeClassName("feed--empty");
      } else {
        this.addClassName("feed--empty");
      }
    }
    if (oldProps.token !== newProps.token) {
      if (!newProps.token) {
        this.closeWebSocket();
      } else {
        this.wsController();
      }
    }
    if (
      oldProps.selectedChatId !== newProps.selectedChatId &&
      !isEqual(oldProps.chatList, newProps.chatList)
    ) {
      this.chatInfo =
        newProps.chatList?.length && newProps.selectedChatId
          ? (newProps.chatList.find(({ id }) => id === newProps.selectedChatId) ?? null)
          : null;
    }
    if (oldProps.inputValue !== newProps.inputValue) {
      const childrenName = "InputMessage";
      if (!Array.isArray(this.children[childrenName])) {
        this.children[childrenName].setProps({
          value: newProps.inputValue,
        });
      }
    }
    if (oldProps.inputError !== newProps.inputError) {
      const childrenName = "InputMessage";
      if (!Array.isArray(this.children[childrenName])) {
        this.children[childrenName].setProps({
          errorMessage: newProps.inputError,
        });
      }
    }
    if (oldProps.showMenu !== newProps.showMenu) {
      const childrenName = "HideMenu";
      if (!Array.isArray(this.children[childrenName])) {
        this.children[childrenName].setProps({
          showMenu: newProps.showMenu,
        });
      }
    }
    return true;
  }

  public render(): string {
    const errorMessage = this.props.errorWS ? JSON.stringify(this.props.errorWS) : "";

    if (this.props.showDialog) {
      return `
        <header class="feed__header">
          <div class="feed__contact">
            {{{ ContactAvatar }}}
            <span>${this.chatInfo?.title}</span>
          </div>
          {{{ MenuButton }}}
        </header>

        <div class="feed__main">
          {{#each messageComponents}}
            {{{ this }}}
          {{/each}}
          ${errorMessage}
        </div>

        <div class="feed__new-message">
          <form id="new-message">
            {{{ InputMessage }}}
            {{{ SendButton }}}
          </form>
        </div>

        {{{ ModalAddUser }}}
        {{{ ModalDeleteUser }}}
        {{{ HideMenu }}}
      `;
    }

    return `
      <p>Выберите чат чтобы отправить сообщение</p>
    `;
  }
}

const ConnectedDialog = connect<TDialogProps>(Dialog, (state) => {
  return {
    chatList: state.chatList ? (state.chatList as IChat[]) : null,
    token: state.token ? (state.token as string) : null,
    userId: state.authUserInfo ? (state.authUserInfo as IUser).id : null,
    selectedChatId: state.selectedChatId ? (state.selectedChatId as number) : null,
    errorWS: state.errorWS ? (state.errorWS as IErrorResponse) : null,
  };
});

export default ConnectedDialog;
