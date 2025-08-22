import type { Avatar } from "../../components";
import Block from "../../core/Block";

export default class UserAvatarButton extends Block {
  constructor(UserAvatar: Avatar, onClick: (e: Event) => void) {
    super("button", {
      type: "button",
      className: "user-profile__avatar-button",
      ariaLabel: "Изменить аватар",
      UserAvatar,
      events: {
        click: onClick,
      },
    });
  }

  render() {
    return `
      {{{ UserAvatar }}}
      <div class="overlay">
        <span>Изменить аватар</span>
      </div>
    `;
  }
}
