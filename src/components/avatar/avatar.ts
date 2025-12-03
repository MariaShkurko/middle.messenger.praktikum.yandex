import Block, { type Props } from "../../core/Block";

type TAvatarProps = Props & {
  avatarUrl?: string;
  width: string;
  height: string;
  className?: string;
};

export default class Avatar extends Block<TAvatarProps> {
  constructor(props: TAvatarProps) {
    super("div", {
      ...props,
      className: `avatar${props.className ? ` ${props.className}` : ""}`,
      style: { "--avatar-width": props.width, "--avatar-height": props.height },
    });
  }

  render() {
    if (this.props.avatarUrl) {
      return `
        <img src="{{avatarUrl}}" alt="avatar" />
      `;
    }
    return "";
  }
}
