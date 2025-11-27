import Block, { type Props } from "../../core/Block";
import Overlay from "./overlay";

type TModalProps = Props & {
  active: boolean;
  content: Block;
};

export default class Modal extends Block<TModalProps> {
  constructor(props: TModalProps) {
    const OverlayComponent = new Overlay({
      onClick: () => {
        this.setProps({ active: false });
      },
    });
    super("div", {
      ...props,
      className: "modal",
      OverlayComponent,
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
      {{{ OverlayComponent }}}
      <div class="modal__content">
        {{{ content }}}
      </div>
    `;
  }
}
