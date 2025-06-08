import Block, { type Props } from "../../core/Block";
import InputComp from "./input";

type TInputProps = Props & {
  id: string;
  formId?: string;
  label?: string;
  value: string;
  type?: "text" | "password";
  errorMessage?: string;
  variant?: "standard" | "outlined" | "line";
  className?: string;
  leftIcon?: string; // svg иконка в raw представлении
  onChange: (e: Event) => void;
  onBlur?: (e: Event) => void;
  disabled?: boolean;
};

const getClassName = (props: TInputProps) => {
  const { variant = "standard", errorMessage, className } = props;
  const classNames = ["input-field", `input-field--${variant}`];
  if (errorMessage) {
    classNames.push("input-field--error");
  }
  if (className) {
    classNames.push(className);
  }
  return classNames.join(" ");
};

export default class Input extends Block {
  constructor(props: TInputProps) {
    const events: Record<string, (e: Event) => void> = {
      change: props.onChange,
    };
    if (props.onBlur) {
      events.blur = props.onBlur;
    }
    super("div", {
      ...props,
      className: getClassName(props),
      change: props.onChange,
      Input: new InputComp({
        ...props,
        placeholder: props.label,
        className: undefined,
        events,
      }),
    });
  }

  public render(): string {
    return `
      {{#if leftIcon}}
        <span class="input-field__left-icon">{{{leftIcon}}}</span>
      {{/if}}
      {{{Input}}}
      <label for={{id}}>{{label}}</label>
      <div class="input-field__error-label">{{errorMessage}}</div>
    `;
  }
}
