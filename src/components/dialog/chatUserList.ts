import Block, { type Props } from "../../core/Block";
import type { IChatUserResponse } from "../../models/IUser";
import { connect } from "../../utils/connect";
import isEqual from "../../utils/isEqual";

type TUserItemProps = Props & {
  id: number;
  login: string;
  selectedUser: { id: number; login: string } | null;
};
type TChatUserListProps = Props & {
  userList: IChatUserResponse[] | null;
  selectedUser: { id: number; login: string } | null;
  onSelectUser: (user: { id: number; login: string }) => void;
};

class UserItem extends Block<TUserItemProps> {
  constructor(props: TUserItemProps) {
    const classNames = ["user-list__item"];
    if (props.selectedUser?.id === props.id) {
      classNames.push("user-list__item--selected");
    }
    super("div", {
      ...props,
      className: classNames.join(" "),
    });
  }

  protected render(): string {
    return `
      <span>{{ login }}</span>
    `;
  }
}

class UserList extends Block<TChatUserListProps> {
  constructor(tagName: string = "div", props: TChatUserListProps) {
    super(tagName, {
      ...props,
      className: "user-list",
      userList: props.userList ?? null,
    });
  }

  protected componentDidUpdate(
    _oldProps: TChatUserListProps,
    _newProps: TChatUserListProps,
  ): boolean {
    if (!isEqual(_oldProps, _newProps)) {
      this.createUserItems();
      return true;
    }
    return false;
  }

  private createUserItems() {
    const { userList, selectedUser, onSelectUser } = this.props;

    const userComponents = userList?.length
      ? userList.map(
          ({ id, login }) =>
            new UserItem({
              id,
              login,
              selectedUser,
              events: {
                click: () => onSelectUser({ id, login }),
              },
            }),
        )
      : [];

    this.children.userComponents = userComponents;
  }

  protected render(): string {
    return `
      {{#each userComponents}}
        {{{ this }}}
      {{/each}}
    `;
  }
}

const ConnectedChatUserList = connect<TChatUserListProps>(UserList, (state) => ({
  userList: state.chatUserList as IChatUserResponse[],
}));

export default ConnectedChatUserList;
