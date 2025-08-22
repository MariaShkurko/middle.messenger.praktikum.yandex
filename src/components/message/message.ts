import Block, { type Props } from "../../core/Block";
import type { TMessage } from "../../types/TMessage";

type TMessageProps = Props & TMessage;

export default class Message extends Block<TMessageProps> {
  constructor(props: TMessageProps) {
    super("div", {
      ...props,
      className: `message${props.isOwn ? " message--own" : ""}${props.imageUrl ? " message--p0" : ""}`,
      time: `${props.dateTime.getHours()}:${props.dateTime.getMinutes()}`,
    });
  }

  protected componentDidUpdate(_oldProps: TMessageProps, _newProps: TMessageProps): boolean {
    if (
      (_oldProps.text === _newProps.text || _oldProps.imageUrl === _newProps.imageUrl) &&
      _oldProps.dateTime === _newProps.dateTime
    )
      return false;
    return true;
  }

  render() {
    return `
      {{#if text}}<p>{{text}}</p>{{/if}}
      {{#if imageUrl}}<img src="{{imageUrl}}" alt="media" class="message__image" />{{/if}}
      <div class="message__time{{#if imageUrl}} message__time--darkened{{/if}}">{{time}}</div>
    `;
  }
}
