import Block, { type Props } from "../../core/Block";

type TButtonProps = Props & {
  variant?: "primary" | "link" | "icon";
  type?: "submit" | "reset" | "button";
  page?: string;
  icon?: string; // svg иконка в raw представлении
  label?: string;
  onClick: (e: Event) => void;
};

const getClassName = (props: TButtonProps) => {
  const { variant = "primary", className } = props;
  const classNames = ["button", `button--${variant}`];
  if (className) {
    classNames.push(className);
  }
  return classNames.join(" ");
};

export default class Button extends Block<TButtonProps> {
  constructor(props: TButtonProps) {
    const { type = "button" } = props;
    const attrs: Record<string, string> = { type };
    if (props.page) attrs["data-page"] = props.page;
    super("button", {
      ...props,
      className: getClassName(props),
      attrs,
      events: {
        click: props.onClick,
      },
    });
  }

  render(): string {
    return `
      {{#if icon}}
        <span class="icon">
          {{{icon}}}
        </span>
      {{else}}
        {{label}}
      {{/if}}
    `;
  }
}
