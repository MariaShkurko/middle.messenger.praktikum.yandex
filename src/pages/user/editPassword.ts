import arrowIcon from "../../assets/arrow-icon.svg?raw";
import { Avatar, Button, Input } from "../../components";
import { INPUT_NAME } from "../../constants/INPUT_NAME";
import { ROUTES } from "../../constants/ROUTES";
import Block, { type Props } from "../../core/Block";
import Router from "../../core/router";
import type { IErrorResponse } from "../../models/IErrorResponse";
import type { IUser } from "../../models/IUser";
import { UserController } from "../../store/UserController";
import { connect } from "../../utils/connect";
import { URL_RESOURCES } from "../../utils/HTTP";
import { validateInput } from "../../utils/validateForm";

type TEditPasswordFormData = {
  oldPassword: string;
  newPassword: string;
  newPasswordAgain: string;
};
type TEditPasswordPageProps = Props & {
  formState: TEditPasswordFormData;
  errors: TEditPasswordFormData;
  error: IErrorResponse | null;
  userInfo: IUser;
};

const router = Router.getInstance("#app");

class EditPasswordPage extends Block<TEditPasswordPageProps> {
  private readonly controllerUser = new UserController();

  static FIELDS = {
    [INPUT_NAME.OLD_PASSWORD]: "InputOldPassword",
    [INPUT_NAME.NEW_PASSWORD]: "InputNewPassword",
    [INPUT_NAME.AGAIN_NEW_PASSWORD]: "InputAgainNewPassword",
  };

  constructor(
    tagName: string = "div",
    props: TEditPasswordPageProps = {} as TEditPasswordPageProps,
  ) {
    const formState = {
      oldPassword: "",
      newPassword: "",
      newPasswordAgain: "",
    };
    const errors = {
      oldPassword: "",
      newPassword: "",
      newPasswordAgain: "",
    };

    const allValidateInput = (): boolean => {
      let isValid = true;

      const newErrors: TEditPasswordFormData = { ...this.props.errors };
      for (const key in this.props.formState) {
        const err = validateInput(key, this.props.formState[key as keyof TEditPasswordFormData]);
        newErrors[key as keyof TEditPasswordFormData] = err;
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

    const BackButton = new Button({
      variant: "icon",
      icon: arrowIcon,
      onClick: (e: Event) => {
        e.preventDefault();
        router.go(ROUTES.MESSENGER);
      },
    });
    const SubmitButton = new Button({
      label: "Сохранить",
      variant: "primary",
      type: "submit",
      onClick: (e) => {
        e.preventDefault();
        if (allValidateInput()) {
          void (async () => {
            try {
              await this.controllerUser.updatePassword(this.props.formState).then(() => {
                router.go(ROUTES.SETTINGS);
              });
            } catch (error) {
              console.error("Ошибка сохранения:", error);
            }
          })();
        }
      },
    });
    const UserAvatar = new Avatar({
      width: "130px",
      height: "130px",
      avatarUrl: props.userInfo?.avatar ? `${URL_RESOURCES}${props.userInfo.avatar}` : "",
    });
    const InputOldPassword = new Input({
      id: INPUT_NAME.OLD_PASSWORD,
      formId: "user-profile-form",
      type: "password",
      variant: "line",
      value: formState.oldPassword,
      errorMessage: errors.oldPassword,
      onChange: (e) => {
        const target = e.target as HTMLInputElement;
        onChange(INPUT_NAME.OLD_PASSWORD, target.value);
      },
      onBlur: (e) => {
        const target = e.target as HTMLInputElement;
        onValidate(INPUT_NAME.OLD_PASSWORD, target.value);
      },
    });
    const InputNewPassword = new Input({
      id: INPUT_NAME.NEW_PASSWORD,
      formId: "user-profile-form",
      type: "password",
      variant: "line",
      value: formState.newPassword,
      errorMessage: errors.newPassword,
      onChange: (e) => {
        const target = e.target as HTMLInputElement;
        onChange(INPUT_NAME.NEW_PASSWORD, target.value);
      },
      onBlur: (e) => {
        const target = e.target as HTMLInputElement;
        onValidate(INPUT_NAME.NEW_PASSWORD, target.value);
      },
    });
    const InputAgainNewPassword = new Input({
      id: INPUT_NAME.AGAIN_NEW_PASSWORD,
      formId: "user-profile-form",
      type: "password",
      variant: "line",
      value: formState.newPasswordAgain,
      errorMessage: errors.newPasswordAgain,
      onChange: (e) => {
        const target = e.target as HTMLInputElement;
        onChange(INPUT_NAME.AGAIN_NEW_PASSWORD, target.value);
      },
      onBlur: (e) => {
        const target = e.target as HTMLInputElement;
        onValidate(INPUT_NAME.AGAIN_NEW_PASSWORD, target.value);
      },
    });

    super(tagName ?? "div", {
      ...props,
      formState,
      errors,
      error: null,
      className: "user-profile",
      BackButton,
      UserAvatar,
      InputOldPassword,
      InputNewPassword,
      InputAgainNewPassword,
      SubmitButton,
    });
  }

  protected componentDidUpdate(
    _oldProps: TEditPasswordPageProps,
    _newProps: TEditPasswordPageProps,
  ): boolean {
    Object.keys(_newProps.formState).forEach((key) => {
      const keyProp = key as keyof TEditPasswordPageProps["formState"];
      if (_newProps.formState[keyProp] !== _oldProps.formState[keyProp]) {
        const childrenName = EditPasswordPage.FIELDS[key];
        if (!Array.isArray(this.children[childrenName])) {
          this.children[childrenName].setProps({
            value: _newProps.formState[keyProp],
          });
          return true;
        }
      }
    });
    Object.keys(_newProps.errors).forEach((key) => {
      const keyProp = key as keyof TEditPasswordPageProps["errors"];
      if (_newProps.errors[keyProp] !== _oldProps.errors[keyProp]) {
        const childrenName = EditPasswordPage.FIELDS[key];
        if (!Array.isArray(this.children[childrenName])) {
          this.children[childrenName].setProps({
            errorMessage: _newProps.errors[keyProp],
          });
          return true;
        }
      }
    });
    if (_oldProps.error !== _newProps.error) {
      return true;
    }

    return false;
  }

  render() {
    const errorMessage = this.props.error ? JSON.stringify(this.props.error) : "";
    return `
      <div class="user-profile__back-button">
        {{{ BackButton }}}
      </div>
      <div class="user-profile__main">
        <form id="user-profile-form">
          <div class="user-profile__short-info">
            {{{ UserAvatar }}}
            <p>{{user.display_name}}</p>
          </div>
          <div>${errorMessage}</div>
          <div class="user-profile__detailed-info">
            <div class="user-profile__line">
              <span>Старый пароль</span>
              {{{ InputOldPassword }}}
            </div>
            <div class="user-profile__line">
              <span>Новый пароль</span>
              {{{ InputNewPassword }}}
            </div>
            <div class="user-profile__line">
              <span>Повторите новый пароль</span>
              {{{ InputAgainNewPassword }}}
            </div>
          </div>
          <div class="user-profile__controls user-profile__controls--edit">
            {{{ SubmitButton }}}
          </div>
        </form>
      </div>
    `;
  }
}

const ConnectedEditPasswordPage = connect<TEditPasswordPageProps>(EditPasswordPage, (state) => ({
  error: state.error as IErrorResponse,
  userInfo: state.authUserInfo as IUser,
}));

export default ConnectedEditPasswordPage;
