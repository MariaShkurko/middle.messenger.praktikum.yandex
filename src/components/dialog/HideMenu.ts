import addIcon from "../../assets/add-icon.svg?raw";
import deleteIcon from "../../assets/delete-icon.svg?raw";
import Block, { type Props } from "../../core/Block";

type THideMenuProps = Props & {
  showMenu: boolean;
  onAddUser: (e: Event) => void;
  onDeleteUser: (e: Event) => void;
};
type TMenuItemProps = Props & {
  icon: string;
  title: string;
  onClick: (e: Event) => void;
};

class MenuItem extends Block<TMenuItemProps> {
  constructor(props: TMenuItemProps) {
    super("div", {
      ...props,
      className: "menu__item",
      events: {
        click: props.onClick,
      },
    });
  }

  protected render(): string {
    return `
      <span class="menu__item-icon">
        {{{icon}}}
      </span>
      <span class="menu__item-title">{{title}}</span>
    `;
  }
}

export default class HideMenu extends Block<THideMenuProps> {
  constructor(props: THideMenuProps) {
    const AddUser = new MenuItem({
      icon: addIcon,
      title: "Добавить пользователя",
      onClick: props.onAddUser,
    });
    const DeleteUser = new MenuItem({
      icon: deleteIcon,
      title: "Удалить пользователя",
      onClick: props.onDeleteUser,
    });
    super("div", {
      ...props,
      className: `menu${props.showMenu ? "" : " menu--hidden"}`,
      AddUser,
      DeleteUser,
    });
  }

  protected componentDidUpdate(_oldProps: THideMenuProps, _newProps: THideMenuProps): boolean {
    if (_oldProps.showMenu !== _newProps.showMenu) {
      if (_newProps.showMenu) {
        this.removeClassName("menu--hidden");
      } else {
        this.addClassName("menu--hidden");
      }
      return true;
    }
    return false;
  }

  protected render(): string {
    return `
      {{{ AddUser }}}
      {{{ DeleteUser }}}
    `;
  }
}
