import type { Props } from "../../core/Block";
import Block from "../../core/Block";

export class UserAvatarForm extends Block<Props> {
  constructor(props: Props) {
    super("form", {
      ...props,
      id: "user-avatar-form",
      className: "user-avatar-form",
    });
  }

  protected render(): string {
    return `
      <p class="modal__title">Загрузите файл</p>
      <label class="avatar-modal__file-label">
        <input type="file" name="avatar" accept="image/*" class="avatar-modal__file-input" />
        <span class="avatar-modal__file-text">Выбрать файл на компьютере</span>
      </label>
      {{{ SubmitAvatarButton }}}
    `;
  }
}
