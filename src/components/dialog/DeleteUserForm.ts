import { Button } from "..";
import type { Props } from "../../core/Block";
import Block from "../../core/Block";
import type { IErrorResponse } from "../../models/IErrorResponse";
import type { IChatUserResponse } from "../../models/IUser";
import { ChatController } from "../../store/ChatController";
import store from "../../store/Store";
import { connect } from "../../utils/connect";
import isEqual from "../../utils/isEqual";
import ChatUserList from "./chatUserList";

type TDeleteUserFormProps = Props & {
  error: IErrorResponse | null;
  userList: IChatUserResponse[] | null;
  selectedChatId: number | null;
  selectedUser: { id: number; login: string } | null;
  onCloseModal: () => void;
};

const controller = new ChatController();

class DeleteUserForm extends Block<TDeleteUserFormProps> {
  constructor(tagName: string = "form", props: TDeleteUserFormProps) {
    const UserListComponent = new ChatUserList("div", {
      userList: null,
      selectedUser: props.selectedUser ?? null,
      onSelectUser: (selectedUser) => {
        const userInfo = this.props.userList?.find(({ id }) => id === selectedUser.id);
        if (userInfo?.role === "admin") {
          store.set("error", { message: "Нельзя удалить администратора" });
        } else {
          this.setProps({ selectedUser });
        }
      },
    });
    const SubmitDeleteUserButton = new Button({
      label: "Удалить",
      type: "submit",
      className: "delete-user-form__submit",
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
              await controller
                .deleteUsers({
                  chatId: this.props.selectedChatId as number,
                  users,
                })
                .then(async () => {
                  this.props.onCloseModal();
                  this.setProps({ selectedUser: null });
                  await controller.getChats({});
                  await controller.getUsersInChat({
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
      id: "delete-user-form",
      className: "delete-user-form",
      UserListComponent,
      SubmitDeleteUserButton,
    });
  }

  private async loadUsers() {
    try {
      if (this.props.selectedChatId) {
        await controller.getUsersInChat({ chatId: this.props.selectedChatId });
      } else {
        throw Error("Не найден id текущего чата");
      }
    } catch (error) {
      console.error("Ошибка загрузки пользователей:", error);
      store.set("error", { message: "Не удалось загрузить пользователей" });
    }
  }

  protected componentDidMount(_oldProps?: TDeleteUserFormProps): void {
    if (this.props.selectedChatId) {
      void this.loadUsers();
    }
  }

  protected componentDidUpdate(
    _oldProps: TDeleteUserFormProps,
    _newProps: TDeleteUserFormProps,
  ): boolean {
    if (!isEqual(_newProps.selectedUser, _oldProps.selectedUser)) {
      const childrenName = "UserListComponent";
      if (!Array.isArray(this.children[childrenName])) {
        this.children[childrenName].setProps({
          selectedUser: _newProps.selectedUser,
        });
        return true;
      }
    }
    if (_newProps.selectedChatId !== _oldProps.selectedChatId) {
      void this.loadUsers();
    }
    return !isEqual(_newProps, _oldProps);
  }

  protected render(): string {
    return `
      ${this.props.error?.message ?? ""}
      {{{ UserListComponent }}}
      {{{ SubmitDeleteUserButton }}}
    `;
  }
}

const ConnectedDeleteUserForm = connect<TDeleteUserFormProps>(DeleteUserForm, (state) => ({
  error: state.error as IErrorResponse,
  userList: state.chatUserList as IChatUserResponse[],
  selectedChatId: state.selectedChatId ? (state.selectedChatId as number) : null,
}));

export default ConnectedDeleteUserForm;
