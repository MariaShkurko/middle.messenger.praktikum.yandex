import Block, { type Props } from "../../core/Block";
import type { IUser } from "../../models/IUser";
import { connect } from "../../utils/connect";
import isEqual from "../../utils/isEqual";

type TUserItemProps = Props & {
  id: number;
  login: string;
  selectedUser: { id: number; login: string } | null;
};
type TUserListProps = Props & {
  userList: IUser[] | null;
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

class UserList extends Block<TUserListProps> {
  constructor(tagName: string = "div", props: TUserListProps) {
    super(tagName, {
      ...props,
      className: "user-list",
      userList: props.userList ?? null,
    });
  }

  protected componentDidUpdate(_oldProps: TUserListProps, _newProps: TUserListProps): boolean {
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

const ConnectedUserList = connect<TUserListProps>(UserList, (state) => ({
  userList: state.userList as IUser[],
}));

export default ConnectedUserList;
