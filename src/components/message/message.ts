import Block, { type Props } from "../../core/Block";
import type { IUser } from "../../models/IUser";
import type { IWSMessage } from "../../models/IWebSocket";
import store from "../../store/Store";
import isEqual from "../../utils/isEqual";

type TMessageProps = Props & IWSMessage;

export default class Message extends Block<TMessageProps> {
  constructor(props: TMessageProps) {
    const dateTime = new Date(props.time);
    const isOwn = props.user_id === (store.getState().authUserInfo as IUser)?.id;

    super("div", {
      ...props,
      className: `message${isOwn ? " message--own" : ""}`,
      time: `${dateTime.getHours()}:${dateTime.getMinutes()}`,
    });
  }

  protected componentDidUpdate(_oldProps: TMessageProps, _newProps: TMessageProps): boolean {
    return !isEqual(_oldProps, _newProps);
  }

  render() {
    return `
      {{#if content}}<p>{{content}}</p>{{/if}}
      <div class="message__time">{{time}}</div>
    `;
  }
}
