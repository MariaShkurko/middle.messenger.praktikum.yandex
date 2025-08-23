import { Avatar, Button, Input, MenuButton, Message } from "..";
import arrowIcon from "../../assets/arrow-icon.svg?raw";
import { INPUT_NAME } from "../../constants/INPUT_NAME";
import Block, { type Props } from "../../core/Block";
import type { TContact, TMessage } from "../../types";
import { validateInput } from "../../utils/validateForm";

type TDialogProps = Props & {
  showDialog: boolean;
  contact?: TContact | null;
  messages?: TMessage[] | null;
};

export default class Dialog extends Block<TDialogProps> {
  private inputValue: string;
  private inputError: string;

  constructor(props: TDialogProps) {
    const showMenu: boolean = false;

    super("div", {
      ...props,
      contact: props.contact || null,
      messages: props.messages || null,
      showMenu,
      className: `feed${!props.showDialog ? " feed--empty" : ""}`,
      messageComponents: props.messages
        ? props.messages.map((message) => new Message(message))
        : [],
    });

    this.inputValue = "";
    this.inputError = "";

    this.children.ContactAvatar = new Avatar({
      width: "34px",
      height: "34px",
      avatarUrl: props.contact?.avatarUrl,
    });
    this.children.MenuButton = new MenuButton({
      onClick: (_e: Event) => {
        this.setProps({
          showMenu: true,
        });
      },
    });
    this.children.InputMessage = new Input({
      id: INPUT_NAME.MESSAGE,
      formId: "new-message",
      label: "Сообщение",
      value: this.inputValue,
      errorMessage: this.inputError,
      variant: "outlined",
      className: "feed__input",
      onChange: (e) => {
        const target = e.target as HTMLInputElement;
        this.inputValue = target.value;
        this.dispatchComponentDidUpdate();
      },
      onBlur: (e) => {
        const target = e.target as HTMLInputElement;
        this.inputError = validateInput(INPUT_NAME.MESSAGE, target.value);
        this.dispatchComponentDidUpdate();
      },
    });
    this.children.SendButton = new Button({
      variant: "icon",
      type: "submit",
      icon: arrowIcon,
      onClick: () => {
        const error = validateInput(INPUT_NAME.MESSAGE, this.inputValue);
        this.inputError = error;

        if (!error) {
          if (Array.isArray(this.children.messageComponents)) {
            this.children.messageComponents.push(
              new Message({ text: this.inputValue, dateTime: new Date(), isOwn: true }),
            );
            this.dispatchComponentDidUpdate();
          }
        }

        this.dispatchComponentDidUpdate();
      },
    });
  }

  protected componentDidUpdate(oldProps: TDialogProps, newProps: TDialogProps): boolean {
    if (oldProps.messages !== newProps.messages && Array.isArray(newProps.messages)) {
      this.children.messageComponents = newProps.messages.map((m) => new Message(m));
    }
    return true;
  }

  public render(): string {
    if (this.props.showDialog) {
      return `
        <header class="feed__header">
          <div class="feed__contact">
            {{{ ContactAvatar }}}
            <span>{{contact.name}}</span>
          </div>
          {{{ MenuButton }}}
        </header>

        <div class="feed__main">
          {{#each messageComponents}}
            {{{ this }}}
          {{/each}}
        </div>

        <div class="feed__new-message">
          <form id="new-message">
            {{{ InputMessage }}}
            {{{ SendButton }}}
          </form>
        </div>
      `;
    }

    return `
      <p>Выберите чат чтобы отправить сообщение</p>
    `;
  }
}
