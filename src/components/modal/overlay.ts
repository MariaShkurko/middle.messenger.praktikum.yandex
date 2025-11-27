import Block, { type Props } from "../../core/Block";

type TOverlayProps = Props & {
  onClick: (e: Event) => void;
};

export default class Overlay extends Block<TOverlayProps> {
  constructor(props: TOverlayProps) {
    super("div", {
      ...props,
      className: "modal__overlay",
      events: {
        click: props.onClick,
      },
    });
  }
}
