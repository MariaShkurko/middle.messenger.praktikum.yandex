import searchIcon from "../../assets/search-icon.svg?raw";
import { Button, ChatItem, Dialog, Input, Modal } from "../../components";
import { ROUTES } from "../../constants/ROUTES";
import Block, { type Props } from "../../core/Block";
import Router from "../../core/router";
import type { IChat } from "../../models/IChat";
import type { IErrorResponse } from "../../models/IErrorResponse";
import type { IUser } from "../../models/IUser";
import { ChatController } from "../../store/ChatController";
import { connect } from "../../utils/connect";
import isEqual from "../../utils/isEqual";
import AddChatForm from "./AddChatForm";
import store from "../../store/Store";

type TChatsPageProps = Props & {
  searchValue: string;
  selectedChatId: number | null;
  chatList: IChat[];
  authUserInfo: IUser;
  error: IErrorResponse | null;
};

const router = Router.getInstance("#app");
class ChatsPage extends Block<TChatsPageProps> {
  private readonly controller = new ChatController();

  constructor(tagName: string = "div", props: TChatsPageProps = {} as TChatsPageProps) {
    const searchValue = props.searchValue || "";
    const selectedChatId = props.selectedChatId || null;

    const ButtonProfile = new Button({
      label: "Профиль",
      variant: "link",
      className: "chats__button-link",
      onClick: (e) => {
        e.preventDefault();
        router.go(ROUTES.SETTINGS);
      },
    });
    const ButtonAddChat = new Button({
      label: "Добавить чат",
      variant: "primary",
      className: "chats__button-add-chat",
      onClick: (e) => {
        e.preventDefault();
        if (!Array.isArray(this.children.ModalAddChat)) {
          this.children.ModalAddChat.setProps({ active: true });
        }
      },
    });
    const InputSearch = new Input({
      id: "search",
      label: "Поиск",
      value: searchValue,
      variant: "outlined",
      leftIcon: searchIcon,
      onChange: (e) => {
        const target = e.target as HTMLInputElement;
        this.setProps({ searchValue: target.value });
      },
      onBlur: (e) => {
        const target = e.target as HTMLInputElement;
        this.setProps({ searchValue: target.value });
      },
    });
    const CurrentDialog = new Dialog("div", {
      showDialog: false,
      selectedChatId: props.selectedChatId,
      chatList: props.chatList,
      token: null,
      userId: props.authUserInfo?.id,
      errorWS: null,
    });
    const AddChatFormComponent = new AddChatForm("form", {
      chatTitle: "",
      userLogin: "",
      error: null,
      userList: null,
      selectedUser: null,
      onCloseModal: () => {
        if (!Array.isArray(this.children.ModalAddChat)) {
          this.children.ModalAddChat.setProps({ active: false });
        }
      },
    });
    const ModalAddChat = new Modal({
      id: "add-chat-modal",
      active: false,
      content: AddChatFormComponent,
    });

    super(tagName ?? "div", {
      authUserInfo: props.authUserInfo || {},
      error: null,
      chatList: props.chatList ?? null,
      searchValue,
      selectedChatId,
      className: "chats",
      ButtonProfile,
      ButtonAddChat,
      InputSearch,
      CurrentDialog,
      ModalAddChat,
    });
  }

  protected componentDidMount() {
    void this.loadChats();
    this.createChatItems();
    setInterval(() => {
      void this.loadChats();
    }, 30000);
  }

  protected componentDidUpdate(_oldProps: TChatsPageProps, _newProps: TChatsPageProps): boolean {
    if (_newProps.searchValue !== _oldProps.searchValue) {
      const childrenName = "InputSearch";
      if (!Array.isArray(this.children[childrenName])) {
        this.children[childrenName].setProps({
          value: _newProps.searchValue,
        });
        return true;
      }
    }
    if (!isEqual(_newProps.chatList, _oldProps.chatList)) {
      this.createChatItems();
    }
    return !isEqual(_oldProps, _newProps);
  }

  private createChatItems() {
    const { selectedChatId, chatList, authUserInfo } = this.props;

    const chatComponents = chatList?.length
      ? chatList.map(
          (chat) =>
            new ChatItem("div", {
              ...chat,
              authUserId: authUserInfo.id,
              selectedChatId,
              events: {
                click: () => {
                  store.set("selectedChatId", chat.id);
                },
              },
            }),
        )
      : [];

    this.children.chatComponents = chatComponents;
  }

  private async loadChats() {
    try {
      await this.controller.getChats({ title: this.props.searchValue });
    } catch (error) {
      console.error("Ошибка загрузки чатов:", error);
      store.set("error", { message: "Не удалось загрузить чаты" });
    }
  }

  public render(): string {
    const errorMessage = this.props.error ? JSON.stringify(this.props.error) : "";

    return `
      <aside class="chats__sidebar">
        <div class="chats__header">
          {{{ ButtonProfile }}}
          {{{ ButtonAddChat }}}
          {{{ InputSearch }}}
        </div>
        <div>${errorMessage}</div>
        <div class="chats__list">
          {{#if chatComponents.length}}
            {{#each chatComponents}}
              {{{ this }}}
            {{/each}}
          {{else}}
            <p class="chats__list--empty">Чаты не найдены</p>
          {{/if}}
        </div>
      </aside>
      <section class="chats__main">
        {{{ CurrentDialog }}}
      </section>

      {{{ ModalAddChat }}}
    `;
  }
}

const ConnectedChatsPage = connect<TChatsPageProps>(ChatsPage, (state) => {
  return {
    error: state.error as IErrorResponse,
    chatList: state.chatList as IChat[],
    authUserInfo: state.authUserInfo as IUser,
    selectedChatId: state.selectedChatId as number,
  };
});

export default ConnectedChatsPage;
