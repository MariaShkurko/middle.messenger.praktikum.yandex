import type { ISignUpRequest } from "../../api/auth-api";
import { Button, Input } from "../../components";
import { INPUT_NAME } from "../../constants/INPUT_NAME";
import { ROUTES } from "../../constants/ROUTES";
import Block, { type Props } from "../../core/Block";
import Router from "../../core/router";
import type { IErrorResponse } from "../../models/IErrorResponse";
import { AuthController } from "../../store/AuthController";
import { connect } from "../../utils/connect";
import { validateInput } from "../../utils/validateForm";

type TRegistrationFormData = ISignUpRequest & {
  again_password: string;
};
type TRegistrationPageProps = Props & {
  formState: TRegistrationFormData;
  errors: TRegistrationFormData;
  error: IErrorResponse;
};

const router = Router.getInstance("#app");

class RegistrationPage extends Block<TRegistrationPageProps> {
  private readonly controller = new AuthController();

  static FIELDS = {
    [INPUT_NAME.EMAIL]: "InputEmail",
    [INPUT_NAME.LOGIN]: "InputLogin",
    [INPUT_NAME.FIRST_NAME]: "InputFirstName",
    [INPUT_NAME.SECOND_NAME]: "InputSecondName",
    [INPUT_NAME.PHONE]: "InputPhone",
    [INPUT_NAME.PASSWORD]: "InputPassword",
    [INPUT_NAME.AGAIN_PASSWORD]: "InputAgainPassword",
  };

  constructor(
    tagName: string = "div",
    props: TRegistrationPageProps = {} as TRegistrationPageProps,
  ) {
    const formState: TRegistrationFormData = {
      first_name: "",
      second_name: "",
      login: "",
      email: "",
      password: "",
      phone: "",
      again_password: "",
    };
    const errors: TRegistrationFormData = {
      email: "",
      login: "",
      first_name: "",
      second_name: "",
      phone: "",
      password: "",
      again_password: "",
    };

    const allValidateInput = (): boolean => {
      let isValid = true;

      const newErrors: TRegistrationFormData = { ...this.props.errors };
      for (const key in this.props.formState) {
        const err = validateInput(key, this.props.formState[key as keyof TRegistrationFormData]);
        newErrors[key as keyof TRegistrationFormData] = err;
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

    const InputEmail = new Input({
      id: INPUT_NAME.EMAIL,
      formId: "registration",
      label: "Почта",
      value: formState.email,
      errorMessage: errors.email,
      type: "email",
      className: "login__input",
      onChange: (e) => {
        const target = e.target as HTMLInputElement;
        onChange(INPUT_NAME.EMAIL, target.value);
      },
      onBlur: (e) => {
        const target = e.target as HTMLInputElement;
        onValidate(INPUT_NAME.EMAIL, target.value);
      },
    });
    const InputLogin = new Input({
      id: INPUT_NAME.LOGIN,
      formId: "registration",
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
    const InputFirstName = new Input({
      id: INPUT_NAME.FIRST_NAME,
      formId: "registration",
      label: "Имя",
      value: formState.first_name,
      errorMessage: errors.first_name,
      className: "login__input",
      onChange: (e) => {
        const target = e.target as HTMLInputElement;
        onChange(INPUT_NAME.FIRST_NAME, target.value);
      },
      onBlur: (e) => {
        const target = e.target as HTMLInputElement;
        onValidate(INPUT_NAME.FIRST_NAME, target.value);
      },
    });
    const InputSecondName = new Input({
      id: INPUT_NAME.SECOND_NAME,
      formId: "registration",
      label: "Фамилия",
      value: formState.second_name,
      errorMessage: errors.second_name,
      className: "login__input",
      onChange: (e) => {
        const target = e.target as HTMLInputElement;
        onChange(INPUT_NAME.SECOND_NAME, target.value);
      },
      onBlur: (e) => {
        const target = e.target as HTMLInputElement;
        onValidate(INPUT_NAME.SECOND_NAME, target.value);
      },
    });
    const InputPhone = new Input({
      id: INPUT_NAME.PHONE,
      formId: "registration",
      label: "Телефон",
      value: formState.phone,
      errorMessage: errors.phone,
      type: "tel",
      className: "login__input",
      onChange: (e) => {
        const target = e.target as HTMLInputElement;
        onChange(INPUT_NAME.PHONE, target.value);
      },
      onBlur: (e) => {
        const target = e.target as HTMLInputElement;
        onValidate(INPUT_NAME.PHONE, target.value);
      },
    });
    const InputPassword = new Input({
      id: INPUT_NAME.PASSWORD,
      formId: "registration",
      label: "Пароль",
      type: "password",
      value: formState.password,
      errorMessage: errors.password,
      className: "login__input",
      onChange: (e) => {
        const target = e.target as HTMLInputElement;
        onChange(INPUT_NAME.PASSWORD, target.value);
      },
      onBlur: (e) => {
        const target = e.target as HTMLInputElement;
        onValidate(INPUT_NAME.PASSWORD, target.value);
      },
    });
    const InputAgainPassword = new Input({
      id: INPUT_NAME.AGAIN_PASSWORD,
      formId: "registration",
      label: "Пароль (ещё раз)",
      type: "password",
      value: formState.again_password,
      errorMessage: errors.again_password,
      onChange: (e) => {
        const target = e.target as HTMLInputElement;
        onChange(INPUT_NAME.AGAIN_PASSWORD, target.value);
      },
      onBlur: (e) => {
        const target = e.target as HTMLInputElement;
        onValidate(INPUT_NAME.AGAIN_PASSWORD, target.value);
      },
    });
    const SignUpButton = new Button({
      label: "Зарегистрироваться",
      variant: "primary",
      type: "submit",
      onClick: (e) => {
        e.preventDefault();
        if (allValidateInput()) {
          void (async () => {
            try {
              await this.controller.signUp(this.props.formState).then(() => {
                window.location.href = ROUTES.MESSENGER;
              });
            } catch (error) {
              console.error("Ошибка регистрации:", error);
            }
          })();
        }
      },
    });
    const SignInButton = new Button({
      label: "Войти",
      variant: "link",
      type: "button",
      onClick: (e) => {
        e.preventDefault();
        router.go(ROUTES.SIGN_IN);
      },
    });

    const combinedProps: TRegistrationPageProps = {
      ...props,
      formState: { ...formState, ...props?.formState },
      errors: { ...errors, ...props?.errors },
      className: "login",
      error: props?.error ?? null,
      InputEmail,
      InputLogin,
      InputFirstName,
      InputSecondName,
      InputPhone,
      InputPassword,
      InputAgainPassword,
      SignUpButton,
      SignInButton,
    };

    super(tagName ?? "div", combinedProps);
  }

  protected componentDidUpdate(
    _oldProps: TRegistrationPageProps,
    _newProps: TRegistrationPageProps,
  ): boolean {
    Object.keys(_newProps.formState).forEach((key) => {
      const keyProp = key as keyof TRegistrationPageProps["formState"];
      if (_newProps.formState[keyProp] !== _oldProps.formState[keyProp]) {
        const childrenName = RegistrationPage.FIELDS[key];
        if (!Array.isArray(this.children[childrenName])) {
          this.children[childrenName].setProps({
            value: _newProps.formState[keyProp],
          });
          return true;
        }
      }
    });
    Object.keys(_newProps.errors).forEach((key) => {
      const keyProp = key as keyof TRegistrationPageProps["errors"];
      if (_newProps.errors[keyProp] !== _oldProps.errors[keyProp]) {
        const childrenName = RegistrationPage.FIELDS[key];
        if (!Array.isArray(this.children[childrenName])) {
          this.children[childrenName].setProps({
            errorMessage: _newProps.errors[keyProp],
          });
          return true;
        }
      }
    });

    return false;
  }

  public render(): string {
    return `
      <form id="registration" class="login__form-card registration__form-card">
        <div>
          <h1 class="login__title">Регистрация</h1>
          {{{ InputEmail }}}
          {{{ InputLogin }}}
          {{{ InputFirstName }}}
          {{{ InputSecondName }}}
          {{{ InputPhone }}}
          {{{ InputPassword }}}
          {{{ InputAgainPassword }}}
        </div>
        <div class="login__button-wrapper">
          {{{ SignUpButton }}}
          {{{ SignInButton }}}
        </div>
      </form>
    `;
  }
}

const ConnectedRegistrationPage = connect<TRegistrationPageProps>(RegistrationPage, (state) => ({
  error: state.error as IErrorResponse,
}));

export default ConnectedRegistrationPage;
