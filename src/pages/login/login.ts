import { Button, Input } from "../../components";
import { INPUT_NAME } from "../../constants/INPUT_NAME";
import Block, { type Props } from "../../core/Block";
import { go } from "../../core/navigate";
import { validateInput } from "../../utils/validateForm";

type TLoginFormData = {
  login: string;
  password: string;
};
type TLoginPageProps = Props & {
  formState: TLoginFormData;
  errors: TLoginFormData;
};

export default class LoginPage extends Block<TLoginPageProps> {
  constructor() {
    const formState = {
      login: "",
      password: "",
    };
    const errors = {
      login: "",
      password: "",
    };

    const allValidateInput = (): boolean => {
      let isValid = true;

      const newErrors: TLoginFormData = { ...errors };
      for (const key in formState) {
        const err = validateInput(key, formState[key as keyof TLoginFormData]);
        newErrors[key as keyof TLoginFormData] = err;
        if (err !== "") {
          isValid = false;
        }
      }

      this.setProps({
        errors: newErrors,
      });

      return isValid;
    };
    const onChange = (id: string, value: string) => {
      this.setProps({
        formState: {
          ...this.props.formState,
          [id]: value,
        },
      });
    };
    const onValidate = (id: string, value: string) => {
      this.setProps({
        errors: {
          ...this.props.errors,
          [id]: validateInput(id, value),
        },
      });
    };
    const onSignIn = () => {
      if (allValidateInput()) {
        console.log(this.props.formState);
      }
    };

    const InputLogin = new Input({
      id: INPUT_NAME.LOGIN,
      formId: "login-form",
      label: "Логин",
      value: formState.login,
      errorMessage: errors.login,
      className: "login__input",
      onChange: (e) => {
        const target = e.target as HTMLInputElement;
        onChange(INPUT_NAME.LOGIN, target.value);
      },
      onBlur: (e) => {
        const target = e.target as HTMLInputElement;
        onValidate(INPUT_NAME.LOGIN, target.value);
      },
    });
    const InputPassword = new Input({
      id: INPUT_NAME.PASSWORD,
      formId: "login-form",
      label: "Пароль",
      type: "password",
      value: formState.password,
      errorMessage: errors.password,
      onChange: (e) => {
        const target = e.target as HTMLInputElement;
        onChange(INPUT_NAME.PASSWORD, target.value);
      },
      onBlur: (e) => {
        const target = e.target as HTMLInputElement;
        onValidate(INPUT_NAME.PASSWORD, target.value);
      },
    });
    const SignInButton = new Button({
      label: "Авторизоваться",
      variant: "primary",
      type: "submit",
      onClick: (e) => {
        e.preventDefault();
        if (allValidateInput()) {
          console.log(this.props.formState);
          go("chats");
        }
      },
    });
    const SignUpButton = new Button({
      label: "Нет аккаунта?",
      variant: "link",
      page: "registration",
      type: "button",
      onClick: (e) => {
        e.preventDefault();
        console.log("navigate to registration");
      },
    });

    super("div", {
      formState,
      errors,
      className: "login",
      InputLogin,
      InputPassword,
      SignInButton,
      SignUpButton,
    });
  }

  protected componentDidUpdate(_oldProps: TLoginPageProps, _newProps: TLoginPageProps): boolean {
    if (_oldProps.formState.login !== _newProps.formState.login) {
      if (!Array.isArray(this.children.InputLogin)) {
        return true;
      }
    }
    if (_oldProps.errors.login !== _newProps.errors.login) {
      if (!Array.isArray(this.children.InputLogin)) {
        return true;
      }
    }

    if (_oldProps.formState.password !== _newProps.formState.password) {
      if (!Array.isArray(this.children.InputPassword)) {
        return true;
      }
    }
    if (_oldProps.errors.password !== _newProps.errors.password) {
      if (!Array.isArray(this.children.InputPassword)) {
        return true;
      }
    }

    return false;
  }

  public render(): string {
    return `
      <form id="login-form" class="login__form-card">
        <div>
          <h1 class="login__title">Вход</h1>
          {{{ InputLogin }}}
          {{{ InputPassword }}}
        </div>
        <div class="login__button-wrapper">
          {{{ SignInButton }}}
          {{{ SignUpButton }}}
        </div>
      </form>
    `;
  }
}
