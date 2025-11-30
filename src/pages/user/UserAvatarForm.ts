import type { Props } from "../../core/Block";
import Block from "../../core/Block";

export class UserAvatarForm extends Block<Props> {
  constructor(props: Props) {
    super("form", {
      ...props,
      className: "user-avatar-form",
      attrs: {
        id: "user-avatar-form",
        enctype: "multipart/form-data",
      },
    });
  }

  protected render(): string {
    return `
      <p class="modal__title">Загрузите файл</p>
      <input type="file" name="avatar" accept="image/*" class="avatar-modal__file-input" />
      <label class="avatar-modal__file-label" for="avatar">
        Выбрать файл на компьютере
      </label>
      {{{ SubmitAvatarButton }}}
    `;
  }
}
