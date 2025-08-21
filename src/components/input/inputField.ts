import Block, { type Props } from "../../core/Block";
import InputComp from "./input";

type TInputProps = Props & {
  id: string;
  formId?: string;
  label?: string;
  value: string;
  type?: "text" | "password" | "email" | "tel";
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
  if (className) {
    classNames.push(className);
  }
  return classNames.join(" ");
};

export default class Input extends Block<TInputProps> {
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
      Input: new InputComp({
        ...props,
        placeholder: props.label,
        className: undefined,
        events,
      }),
    });
  }

  protected componentDidUpdate(_oldProps: TInputProps, _newProps: TInputProps): boolean {
    if (_oldProps.errorMessage !== _newProps.errorMessage) {
      if (_newProps.errorMessage) {
        this.addClassName("input-field--error");
      } else {
        this.removeClassName("input-field--error");
      }

      return true;
    }

    if (_oldProps.value !== _newProps.value) {
      return true;
    }

    return false;
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
