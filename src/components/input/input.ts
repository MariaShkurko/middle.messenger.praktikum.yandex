import Block, { type Props } from "../../core/Block";

type TInputCompProps = Props & {
  id: string;
  formId?: string;
  value: string;
  type?: "text" | "password" | "email" | "tel";
  placeholder?: string;
  disabled?: boolean;
};

export default class InputComp extends Block<TInputCompProps> {
  constructor(props: TInputCompProps) {
    super("input", {
      ...props,
      attrs: InputComp.makeAttrs(props),
    });
  }

  static makeAttrs(props: TInputCompProps): Record<string, string> {
    const attrs: Record<string, string> = {
      id: props.id ?? "",
      name: props.id ?? "",
      type: props.type ?? "text",
      form: props.formId ?? "",
      placeholder: props.placeholder ?? "",
      value: props.value ?? "",
      autocomplete: "off",
    };
    if (props.disabled) {
      attrs.disabled = "";
    }
    return attrs;
  }

  protected componentDidUpdate(_oldProps: TInputCompProps, newProps: TInputCompProps): boolean {
    if (!this.element) return false;

    if (newProps.value !== undefined) {
      (this.element as HTMLInputElement).value = newProps.value;
    }

    if (newProps.disabled !== undefined) {
      if (newProps.disabled) {
        (this.element as HTMLInputElement).setAttribute("disabled", "");
      } else {
        (this.element as HTMLInputElement).removeAttribute("disabled");
      }
    }

    return true;
  }
}
