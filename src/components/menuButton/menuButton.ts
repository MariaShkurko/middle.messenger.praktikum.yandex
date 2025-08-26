import Block, { type Props } from "../../core/Block";

type TMenuButtonProps = Props & {
  onClick: (e: Event) => void;
};

export default class MenuButton extends Block<TMenuButtonProps> {
  constructor(props: TMenuButtonProps) {
    super("div", {
      ...props,
      className: "menu-button",
      events: {
        click: props.onClick,
      },
    });
  }

  render() {
    return `
      <div class="point"></div>
      <div class="point"></div>
      <div class="point"></div>
    `;
  }
}
