import { Button, Input, UserList } from "../../components";
import type { Props } from "../../core/Block";
import Block from "../../core/Block";
import type { IErrorResponse } from "../../models/IErrorResponse";
import type { IUser } from "../../models/IUser";
import { ChatController } from "../../store/ChatController";
import store from "../../store/Store";
import { UserController } from "../../store/UserController";
import { connect } from "../../utils/connect";
import isEqual from "../../utils/isEqual";

type TAddChatFormProps = Props & {
  chatTitle: string;
  userLogin: string;
  error: IErrorResponse | null;
  userList: IUser[] | null;
  selectedUser: { id: number; login: string } | null;
  onCloseModal: () => void;
};

const controllerChat = new ChatController();
const controllerUser = new UserController();

class AddChatForm extends Block<TAddChatFormProps> {
  constructor(tagName: string = "form", props: TAddChatFormProps) {
    const chatTitle = "";
    const userLogin = "";

    const InputTitle = new Input({
      id: "modalChatTitle",
      formId: "add-chat-form",
      label: "Название чата",
      value: chatTitle,
      onChange: (e) => {
        const target = e.target as HTMLInputElement;
        this.setProps({ chatTitle: target.value });
      },
      onBlur: (e) => {
        const target = e.target as HTMLInputElement;
        this.setProps({ chatTitle: target.value });
      },
    });
    const InputLogin = new Input({
      id: "modalChatUser",
      formId: "add-chat-form",
      label: "Логин пользователя",
      value: userLogin,
      onChange: (e) => {
        const target = e.target as HTMLInputElement;
        this.setProps({ userLogin: target.value });
      },
      onBlur: (e) => {
        const target = e.target as HTMLInputElement;
        this.setProps({ userLogin: target.value });
      },
    });
    const UserListComponent = new UserList("div", {
      userList: null,
      selectedUser: props.selectedUser ?? null,
      onSelectUser: (selectedUser) => {
        this.setProps({ selectedUser });
      },
    });
    const SubmitAddChatButton = new Button({
      label: "Добавить",
      type: "submit",
      className: "avatar-modal__submit",
      onClick: (e) => {
        e.preventDefault();
        if (this.props.chatTitle && this.props.selectedUser) {
          void (async () => {
            try {
              const users = [(store.getState().authUserInfo as IUser)?.id];
              // Всё ради типизации, TS отказывается верить проверке выше
              if (this.props.selectedUser) {
                users.push(this.props.selectedUser.id);
              }
              await controllerChat
                .createChat({
                  title: this.props.chatTitle,
                  users,
                })
                .then(async () => {
                  this.props.onCloseModal();
                  this.setProps({ chatTitle: "", selectedUser: null });
                  await controllerChat.getChats({});
                });
            } catch (error) {
              console.error("Ошибка создания чата:", error);
            }
          })();
        }
      },
    });
    super(tagName, {
      ...props,
      id: "add-chat-form",
      className: "add-chat-form",
      chatTitle,
      userLogin,
      InputTitle,
      InputLogin,
      UserListComponent,
      SubmitAddChatButton,
    });
  }

  private async loadUsers() {
    try {
      await controllerUser.searchUsers({ login: this.props.userLogin });
    } catch (error) {
      console.error("Ошибка загрузки пользователей:", error);
      store.set("error", { message: "Не удалось загрузить пользователей" });
    }
  }

  protected componentDidUpdate(
    _oldProps: TAddChatFormProps,
    _newProps: TAddChatFormProps,
  ): boolean {
    if (_newProps.chatTitle !== _oldProps.chatTitle) {
      const childrenName = "InputTitle";
      if (!Array.isArray(this.children[childrenName])) {
        this.children[childrenName].setProps({
          value: _newProps.chatTitle,
        });
        return true;
      }
    }
    if (_newProps.userLogin !== _oldProps.userLogin) {
      void this.loadUsers();
      const childrenName = "InputLogin";
      if (!Array.isArray(this.children[childrenName])) {
        this.children[childrenName].setProps({
          value: _newProps.userLogin,
        });
        return true;
      }
    }
    if (!isEqual(_newProps.selectedUser, _oldProps.selectedUser)) {
      const childrenName = "UserListComponent";
      if (!Array.isArray(this.children[childrenName])) {
        this.children[childrenName].setProps({
          selectedUser: _newProps.selectedUser,
        });
        return true;
      }
    }
    return !isEqual(_newProps, _oldProps);
  }

  protected render(): string {
    return `
      {{{ InputTitle }}}
      {{{ InputLogin }}}
      {{{ UserListComponent }}}
      {{{ SubmitAddChatButton }}}
    `;
  }
}

const ConnectedAddChatForm = connect<TAddChatFormProps>(AddChatForm, (state) => ({
  error: state.error as IErrorResponse,
  userList: state.userList as IUser[],
}));

export default ConnectedAddChatForm;
