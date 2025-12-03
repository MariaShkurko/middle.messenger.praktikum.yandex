import { Button, Input, UserList } from "..";
import type { Props } from "../../core/Block";
import Block from "../../core/Block";
import type { IErrorResponse } from "../../models/IErrorResponse";
import type { IUser } from "../../models/IUser";
import { ChatController } from "../../store/ChatController";
import store from "../../store/Store";
import { UserController } from "../../store/UserController";
import { connect } from "../../utils/connect";
import isEqual from "../../utils/isEqual";

type TAddUserFormProps = Props & {
  userLogin: string;
  error: IErrorResponse | null;
  userList: IUser[] | null;
  selectedChatId: number | null;
  selectedUser: { id: number; login: string } | null;
  onCloseModal: () => void;
};

class AddUserForm extends Block<TAddUserFormProps> {
  private readonly controllerChat = new ChatController();
  private readonly controllerUser = new UserController();

  constructor(tagName: string = "form", props: TAddUserFormProps) {
    const userLogin = "";

    const InputLogin = new Input({
      id: "modalChatUser",
      formId: "add-user-form",
      label: "Логин",
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
      error: null,
      selectedUser: props.selectedUser ?? null,
      onSelectUser: (selectedUser) => {
        this.setProps({ selectedUser });
      },
    });
    const SubmitAddUserButton = new Button({
      label: "Добавить",
      type: "submit",
      className: "add-user-form__submit",
      onClick: (e) => {
        e.preventDefault();
        if (this.props.selectedUser && this.props.selectedChatId) {
          void (async () => {
            try {
              // Всё ради типизации, TS отказывается верить проверке выше
              const users = [];
              if (this.props.selectedUser) {
                users.push(this.props.selectedUser.id);
              }
              await this.controllerChat
                .addUsers({
                  chatId: this.props.selectedChatId as number,
                  users,
                })
                .then(async () => {
                  this.props.onCloseModal();
                  this.setProps({ userLogin: "", selectedUser: null });
                  await this.controllerChat.getChats({});
                  await this.controllerChat.getUsersInChat({
                    chatId: this.props.selectedChatId as number,
                  });
                });
            } catch (error) {
              console.error("Ошибка добавления пользователя:", error);
            }
          })();
        }
      },
    });
    super(tagName, {
      ...props,
      id: "add-user-form",
      className: "add-user-form",
      userLogin,
      InputLogin,
      UserListComponent,
      SubmitAddUserButton,
    });
  }

  private async loadUsers() {
    try {
      await this.controllerUser.searchUsers({ login: this.props.userLogin });
    } catch (error) {
      console.error("Ошибка загрузки пользователей:", error);
      store.set("error", { message: "Не удалось загрузить пользователей" });
    }
  }

  protected componentDidUpdate(
    _oldProps: TAddUserFormProps,
    _newProps: TAddUserFormProps,
  ): boolean {
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
    const errorMessage = this.props.error ? JSON.stringify(this.props.error) : "";
    return `
      ${errorMessage}
      {{{ InputLogin }}}
      {{{ UserListComponent }}}
      {{{ SubmitAddUserButton }}}
    `;
  }
}

const ConnectedAddUserForm = connect<TAddUserFormProps>(AddUserForm, (state) => ({
  error: state.error as IErrorResponse,
  userList: state.userList as IUser[],
  selectedChatId: state.selectedChatId ? (state.selectedChatId as number) : null,
}));

export default ConnectedAddUserForm;
