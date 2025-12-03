import { Button, Input } from "../../components";
import { INPUT_NAME } from "../../constants/INPUT_NAME";
import { ROUTES } from "../../constants/ROUTES";
import Block, { type Props } from "../../core/Block";
import Router from "../../core/router";
import type { IErrorResponse } from "../../models/IErrorResponse";
import { AuthController } from "../../store/AuthController";
import { connect } from "../../utils/connect";
import { validateInput } from "../../utils/validateForm";

type TLoginFormData = {
  login: string;
  password: string;
};
type TLoginPageProps = Props & {
  formState: TLoginFormData;
  errors: TLoginFormData;
};

const router = Router.getInstance("#app");

class LoginPage extends Block<TLoginPageProps> {
  private readonly controller = new AuthController();

  constructor(tagName: string = "div", props: TLoginPageProps = {} as TLoginPageProps) {
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

      const newErrors: TLoginFormData = { ...this.props.errors };
      for (const key in this.props.formState) {
        const err = validateInput(key, this.props.formState[key as keyof TLoginFormData]);
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
          void (async () => {
            try {
              await this.controller.signIn(this.props.formState).then(() => {
                router.go(ROUTES.MESSENGER);
              });
            } catch (error) {
              console.error("Ошибка входа:", error);
            }
          })();
        }
      },
    });
    const SignUpButton = new Button({
      label: "Нет аккаунта?",
      variant: "link",
      type: "button",
      onClick: (e) => {
        e.preventDefault();
        router.go(ROUTES.SIGN_UP);
      },
    });

    const combinedProps: TLoginPageProps = {
      ...props,
      formState: { ...formState, ...props?.formState },
      errors: { ...errors, ...props?.errors },
      className: "login",
      error: props?.error ?? null,
      InputLogin,
      InputPassword,
      SignUpButton,
      SignInButton,
    };

    super(tagName ?? "div", combinedProps);
  }

  protected componentDidUpdate(_oldProps: TLoginPageProps, _newProps: TLoginPageProps): boolean {
    if (!Array.isArray(this.children.InputLogin)) {
      this.children.InputLogin.setProps({
        value: _newProps.formState.login,
        errorMessage: _newProps.errors.login,
      });
    }
    if (!Array.isArray(this.children.InputPassword)) {
      this.children.InputPassword.setProps({
        value: _newProps.formState.password,
        errorMessage: _newProps.errors.password,
      });
    }

    return true;
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

const ConnectedLoginPage = connect<TLoginPageProps>(LoginPage, (state) => ({
  error: state.error as IErrorResponse,
}));

export default ConnectedLoginPage;
