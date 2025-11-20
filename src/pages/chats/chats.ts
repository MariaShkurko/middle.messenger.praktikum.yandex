import searchIcon from "../../assets/search-icon.svg?raw";
import { Button, ChatItem, Dialog, Input } from "../../components";
import { ROUTES } from "../../constants/ROUTES";
import Block, { type Props } from "../../core/Block";
import Router from "../../core/router";
import { chats as chatsMockData, messages } from "../../mockData";

type TChatsPageProps = Props & {
  searchValue: string;
  selectedChatId: string | null;
};

const router = Router.getInstance("#app");

export default class ChatsPage extends Block<TChatsPageProps> {
  constructor() {
    const searchValue = "";
    const selectedChatId = null;

    const ButtonProfile = new Button({
      label: "Профиль",
      variant: "link",
      className: "chats__button-link",
      onClick: (e) => {
        e.preventDefault();
        router.go(ROUTES.SETTINGS);
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
    });
    const CurrentDialog = new Dialog({
      showDialog: false,
    });
    const chatComponents = chatsMockData
      ? chatsMockData.map(
          (chat) =>
            new ChatItem({
              ...chat,
              selected: false,
              events: {
                click: () => {
                  this.setProps({
                    selectedChatId: chat.id,
                  });
                },
              },
            }),
        )
      : [];

    super("div", {
      searchValue,
      selectedChatId,
      className: "chats",
      ButtonProfile,
      InputSearch,
      CurrentDialog,
      chatComponents,
    });
  }

  public render(): string {
    const { selectedChatId } = this.props;
    const { chatComponents, CurrentDialog } = this.children;

    if (Array.isArray(chatComponents)) {
      chatComponents.forEach((chat) => {
        if (selectedChatId === chat.props.id) {
          chat.setProps({ selected: true });
          return;
        }

        if (chat.props.selected) {
          chat.setProps({ selected: false });
        }
      });
    }

    if (selectedChatId) {
      const currentChat = chatsMockData.find(({ id }) => id === selectedChatId);
      if (!Array.isArray(CurrentDialog)) {
        CurrentDialog.setProps({
          showDialog: true,
          contact: currentChat?.contact,
          messages: messages,
        });
      }
    }

    return `
      <aside class="chats__sidebar">
        <div class="chats__header">
          {{{ ButtonProfile }}}
          {{{ InputSearch }}}
        </div>
        <div class="chats__list">
          {{#each chatComponents}}
            {{{ this }}}
          {{/each}}
        </div>
      </aside>
      <section class="chats__main">
        {{{ CurrentDialog }}}
      </section>
    `;
  }
}
