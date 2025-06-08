import Block, { type Props } from "../../core/Block";

type TInputCompProps = Props & {
  id: string;
  formId?: string;
  value: string;
  type?: "text" | "password";
  placeholder?: string;
  disabled?: boolean;
};

export default class InputComp extends Block {
  constructor(props: TInputCompProps) {
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
    super("input", { ...props, attrs });
  }
}
