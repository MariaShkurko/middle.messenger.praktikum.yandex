import { Button, Input } from "../../components";
import { INPUT_NAME, type TInputName } from "../../constants/INPUT_NAME";
import Block, { type Props } from "../../core/Block";
import { validateInput } from "../../utils/validateForm";

type TRegistrationPageProps = Props & {
  formState: {
    email: string;
    login: string;
    first_name: string;
    second_name: string;
    phone: string;
    password: string;
    again_password: string;
  };
  errors: {
    email: string;
    login: string;
    first_name: string;
    second_name: string;
    phone: string;
    password: string;
    again_password: string;
  };
};

export default class RegistrationPage extends Block<TRegistrationPageProps> {
  static FIELDS = {
    [INPUT_NAME.EMAIL]: "InputEmail",
    [INPUT_NAME.LOGIN]: "InputLogin",
    [INPUT_NAME.FIRST_NAME]: "InputFirstName",
    [INPUT_NAME.SECOND_NAME]: "InputSecondName",
    [INPUT_NAME.PHONE]: "InputPhone",
    [INPUT_NAME.PASSWORD]: "InputPassword",
    [INPUT_NAME.AGAIN_PASSWORD]: "InputAgainPassword",
  };

  constructor() {
    const formState = {
      email: "",
      login: "",
      first_name: "",
      second_name: "",
      phone: "",
      password: "",
      again_password: "",
    };
    const errors = {
      email: "",
      login: "",
      first_name: "",
      second_name: "",
      phone: "",
      password: "",
      again_password: "",
    };

    const onChange = (id: string, value: string) => {
      console.log(id, value, validateInput(id, value));
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
    });
    const SignUpButton = new Button({
      label: "Зарегистрироваться",
      variant: "primary",
      page: "chats",
      type: "submit",
      onClick: (e) => {
        e.preventDefault();
        console.log(this.props.formState);
      },
    });
    const SignInButton = new Button({
      label: "Войти",
      variant: "link",
      page: "login",
      type: "button",
      onClick: (e) => {
        e.preventDefault();
        console.log("navigate to login");
      },
    });

    super("div", {
      formState,
      errors,
      className: "login",
      InputEmail,
      InputLogin,
      InputFirstName,
      InputSecondName,
      InputPhone,
      InputPassword,
      InputAgainPassword,
      SignUpButton,
      SignInButton,
    });
  }

  protected componentDidUpdate(
    _oldProps: TRegistrationPageProps,
    _newProps: TRegistrationPageProps,
  ): boolean {
    console.log(_oldProps, _newProps);
    Object.keys(_newProps.formState).forEach((key) => {
      const keyProp = key as keyof TRegistrationPageProps["formState"];
      if (_newProps.formState[keyProp] !== _oldProps.formState[keyProp]) {
        const childrenName = RegistrationPage.FIELDS[key];
        if (!Array.isArray(this.children[childrenName])) {
          return true;
        }
      }
    });
    Object.keys(_newProps.errors).forEach((key) => {
      const keyProp = key as keyof TRegistrationPageProps["errors"];
      if (_newProps.errors[keyProp] !== _oldProps.errors[keyProp]) {
        const childrenName = RegistrationPage.FIELDS[key];
        if (!Array.isArray(this.children[childrenName])) {
          if (_newProps.errors[keyProp]) {
            this.children[childrenName].addClassName("login__input--error");
          } else {
            this.children[childrenName].removeClassName("login__input--error");
          }
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
