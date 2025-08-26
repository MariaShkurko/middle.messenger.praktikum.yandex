import Block, { type Props } from "../../core/Block";

type TModalProps = Props & {
  active: boolean;
  children: string;
};

export default class Modal extends Block<TModalProps> {
  constructor(props: TModalProps) {
    super("div", {
      ...props,
      className: "modal",
    });
  }

  protected componentDidUpdate(_oldProps: TModalProps, _newProps: TModalProps): boolean {
    if (_oldProps.active !== _newProps.active) {
      if (_newProps.active) {
        this.addClassName("modal--active");
      } else {
        this.removeClassName("modal--active");
      }
      return false;
    }
    return true;
  }

  protected render(): string {
    return `
      <div class="modal__overlay"></div>
      <div class="modal__content">
        {{{ children }}}
      </div>
    `;
  }
}
