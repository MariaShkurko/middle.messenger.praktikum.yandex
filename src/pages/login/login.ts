import { Button, Input } from "../../components";
import { INPUT_NAME } from "../../constants/INPUT_NAME";
import Block, { type Props } from "../../core/Block";
import { validateInput } from "../../utils/validateForm";

type TLoginPageProps = Props & {
  formState: {
    login: string;
    password: string;
  };
  errors: {
    login: string;
    password: string;
  };
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

    const onChange = (id: string, value: string) => {
      this.setProps({
        formState: {
          ...this.props.formState,
          [id]: value,
        },
        errors: {
          ...this.props.errors,
          [id]: validateInput(id, value),
        },
      });
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
    });
    const SignInButton = new Button({
      label: "Авторизоваться",
      variant: "primary",
      page: "chats",
      type: "submit",
      onClick: (e) => {
        e.preventDefault();
        console.log(this.props.formState);
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
        this.children.InputLogin.setProps({ value: _newProps.formState.login });
      }
    }
    if (_oldProps.errors.login !== _newProps.errors.login) {
      if (!Array.isArray(this.children.InputLogin)) {
        this.children.InputLogin.setProps({ errorMessage: _newProps.errors.login });
      }
    }

    if (_oldProps.formState.password !== _newProps.formState.password) {
      if (!Array.isArray(this.children.InputPassword)) {
        this.children.InputPassword.setProps({ value: _newProps.formState.password });
      }
    }
    if (_oldProps.errors.password !== _newProps.errors.password) {
      if (!Array.isArray(this.children.InputPassword)) {
        this.children.InputPassword.setProps({ errorMessage: _newProps.errors.password });
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
