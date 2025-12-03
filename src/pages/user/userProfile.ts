import arrowIcon from "../../assets/arrow-icon.svg?raw";
import { Avatar, Button, Input, Modal } from "../../components";
import { INPUT_NAME } from "../../constants/INPUT_NAME";
import { ROUTES } from "../../constants/ROUTES";
import Block, { type Props } from "../../core/Block";
import Router from "../../core/router";
import type { IErrorResponse } from "../../models/IErrorResponse";
import type { IUser } from "../../models/IUser";
import { AuthController } from "../../store/AuthController";
import { UserController } from "../../store/UserController";
import { connect } from "../../utils/connect";
import { validateInput } from "../../utils/validateForm";
import UserAvatarButton from "./userAvatarButton";
import { UserAvatarForm } from "./UserAvatarForm";
import isEqual from "../../utils/isEqual";
import { URL_RESOURCES } from "../../utils/HTTP";

type TUserProfileFormData = {
  email: string;
  login: string;
  first_name: string;
  second_name: string;
  display_name: string;
  phone: string;
};
type TUserProfilePageProps = Props & {
  formState: TUserProfileFormData;
  errors: TUserProfileFormData;
  userInfo: IUser;
  isEdit: boolean;
  error: IErrorResponse | null;
};

const router = Router.getInstance("#app");

class UserProfilePage extends Block<TUserProfilePageProps> {
  private readonly controllerAuth = new AuthController();
  private readonly controllerUser = new UserController();

  static FIELDS = {
    [INPUT_NAME.EMAIL]: "InputEmail",
    [INPUT_NAME.LOGIN]: "InputLogin",
    [INPUT_NAME.FIRST_NAME]: "InputFirstName",
    [INPUT_NAME.SECOND_NAME]: "InputSecondName",
    [INPUT_NAME.DISPLAY_NAME]: "InputDisplayName",
    [INPUT_NAME.PHONE]: "InputPhone",
  };

  constructor(tagName: string = "div", props: TUserProfilePageProps = {} as TUserProfilePageProps) {
    const formState = {
      email: props.userInfo?.email ?? "",
      login: props.userInfo?.login ?? "",
      first_name: props.userInfo?.first_name ?? "",
      second_name: props.userInfo?.second_name ?? "",
      display_name: props.userInfo?.display_name ?? "",
      phone: props.userInfo?.phone ?? "",
    };
    const errors = {
      email: "",
      login: "",
      first_name: "",
      second_name: "",
      display_name: "",
      phone: "",
    };
    const isEdit = false;

    const allValidateInput = (): boolean => {
      let isValid = true;

      const newErrors: TUserProfileFormData = { ...this.props.errors };
      for (const key in this.props.formState) {
        const err = validateInput(key, this.props.formState[key as keyof TUserProfileFormData]);
        newErrors[key as keyof TUserProfileFormData] = err;
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
    const onChangeIsEdit = (newValue: boolean) => {
      this.setProps({ isEdit: newValue });
    };

    const BackButton = new Button({
      variant: "icon",
      icon: arrowIcon,
      onClick: (e: Event) => {
        e.preventDefault();
        router.go(ROUTES.MESSENGER);
      },
    });
    const EditProfileButton = new Button({
      label: "Изменить данные",
      variant: "link",
      type: "button",
      onClick: (e) => {
        e.preventDefault();
        onChangeIsEdit(true);
      },
    });
    const EditPasswordButton = new Button({
      label: "Изменить пароль",
      variant: "link",
      type: "button",
      onClick: (e) => {
        e.preventDefault();
        router.go(ROUTES.EDIT_PASSWORD);
      },
    });
    const ExitButton = new Button({
      label: "Выйти",
      variant: "link",
      type: "button",
      onClick: (e) => {
        e.preventDefault();
        void (async () => {
          try {
            await this.controllerAuth.logOut().then(() => {
              router.go(ROUTES.SIGN_IN);
            });
          } catch (error) {
            console.error("Ошибка выхода:", error);
          }
        })();
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
              await this.controllerUser.updateProfile(this.props.formState).then(() => {
                onChangeIsEdit(false);
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
    const UserAvatarBtn = new UserAvatarButton(UserAvatar, (e) => {
      e.preventDefault();
      if (!Array.isArray(this.children.ModalChangeAvatar)) {
        this.children.ModalChangeAvatar.setProps({ active: true });
      }
    });
    const InputEmail = new Input({
      id: INPUT_NAME.EMAIL,
      formId: "user-profile-form",
      type: "email",
      variant: "line",
      value: formState.email,
      errorMessage: errors.email,
      disabled: !isEdit,
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
      formId: "user-profile-form",
      type: "text",
      variant: "line",
      value: formState.login,
      errorMessage: errors.login,
      disabled: !isEdit,
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
      formId: "user-profile-form",
      type: "text",
      variant: "line",
      value: formState.first_name,
      errorMessage: errors.first_name,
      disabled: !isEdit,
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
      formId: "user-profile-form",
      type: "text",
      variant: "line",
      value: formState.second_name,
      errorMessage: errors.second_name,
      disabled: !isEdit,
      onChange: (e) => {
        const target = e.target as HTMLInputElement;
        onChange(INPUT_NAME.SECOND_NAME, target.value);
      },
      onBlur: (e) => {
        const target = e.target as HTMLInputElement;
        onValidate(INPUT_NAME.SECOND_NAME, target.value);
      },
    });
    const InputDisplayName = new Input({
      id: INPUT_NAME.DISPLAY_NAME,
      formId: "user-profile-form",
      type: "text",
      variant: "line",
      value: formState.display_name,
      errorMessage: errors.display_name,
      disabled: !isEdit,
      onChange: (e) => {
        const target = e.target as HTMLInputElement;
        onChange(INPUT_NAME.DISPLAY_NAME, target.value);
      },
      onBlur: (e) => {
        const target = e.target as HTMLInputElement;
        onValidate(INPUT_NAME.DISPLAY_NAME, target.value);
      },
    });
    const InputPhone = new Input({
      id: INPUT_NAME.PHONE,
      formId: "user-profile-form",
      type: "tel",
      variant: "line",
      value: formState.phone,
      errorMessage: errors.phone,
      disabled: !isEdit,
      onChange: (e) => {
        const target = e.target as HTMLInputElement;
        onChange(INPUT_NAME.PHONE, target.value);
      },
      onBlur: (e) => {
        const target = e.target as HTMLInputElement;
        onValidate(INPUT_NAME.PHONE, target.value);
      },
    });
    const SubmitAvatarButton = new Button({
      label: "Изменить",
      type: "submit",
      className: "avatar-modal__submit",
      onClick: (e) => {
        e.preventDefault();
        void (async () => {
          try {
            const form = document.getElementById("user-avatar-form") as HTMLFormElement;
            const formData = new FormData(form);
            await this.controllerUser.updateAvatar(formData).then(() => {
              if (!Array.isArray(this.children.ModalChangeAvatar)) {
                this.children.ModalChangeAvatar.setProps({ active: false });
              }
            });
          } catch (error) {
            console.error("Ошибка сохранения:", error);
          }
        })();
      },
    });
    const UserAvatarFormComponent = new UserAvatarForm({ SubmitAvatarButton });
    const ModalChangeAvatar = new Modal({
      id: "change-avatar-modal",
      active: false,
      content: UserAvatarFormComponent,
    });

    super(tagName ?? "div", {
      ...props,
      formState,
      errors,
      error: null,
      isEdit,
      className: "user-profile",
      BackButton,
      UserAvatar,
      UserAvatarBtn,
      InputEmail,
      InputLogin,
      InputFirstName,
      InputSecondName,
      InputDisplayName,
      InputPhone,
      EditProfileButton,
      EditPasswordButton,
      ExitButton,
      SubmitButton,
      SubmitAvatarButton,
      ModalChangeAvatar,
    });
  }

  protected componentDidMount(_oldProps?: TUserProfilePageProps): void {
    if (!_oldProps?.userInfo?.id) {
      void this.controllerAuth.getAuthUserInfo();
    }
  }

  protected componentDidUpdate(
    _oldProps: TUserProfilePageProps,
    _newProps: TUserProfilePageProps,
  ): boolean {
    if (!isEqual(_newProps.formState, _oldProps.formState)) {
      Object.keys(_newProps.formState).forEach((key) => {
        const keyProp = key as keyof TUserProfilePageProps["formState"];
        if (_newProps.formState[keyProp] !== _oldProps.formState[keyProp]) {
          const childrenName = UserProfilePage.FIELDS[key];
          if (!Array.isArray(this.children[childrenName])) {
            this.children[childrenName].setProps({
              value: _newProps.formState[keyProp],
            });
            return true;
          }
        }
      });
    }
    if (!isEqual(_newProps.errors, _oldProps.errors)) {
      Object.keys(_newProps.errors).forEach((key) => {
        const keyProp = key as keyof TUserProfilePageProps["errors"];
        if (_newProps.errors[keyProp] !== _oldProps.errors[keyProp]) {
          const childrenName = UserProfilePage.FIELDS[key];
          if (!Array.isArray(this.children[childrenName])) {
            this.children[childrenName].setProps({
              errorMessage: _newProps.errors[keyProp],
            });
            return true;
          }
        }
      });
    }

    if (_oldProps.isEdit !== _newProps.isEdit) {
      Object.values(UserProfilePage.FIELDS).forEach((childrenName) => {
        if (!Array.isArray(this.children[childrenName])) {
          this.children[childrenName].setProps({
            disabled: !_newProps.isEdit,
          });
        }
      });
      return true;
    }
    if (JSON.stringify(_oldProps.error) !== JSON.stringify(_newProps.error)) {
      return true;
    }

    if (_oldProps.userInfo?.avatar !== _newProps.userInfo?.avatar) {
      if (!Array.isArray(this.children.UserAvatar)) {
        this.children.UserAvatar.setProps({
          avatarUrl: _newProps.userInfo?.avatar
            ? `${URL_RESOURCES}${_newProps.userInfo.avatar}`
            : "",
        });
      }
    }
    const oldUserInfo = {
      email: _oldProps.userInfo?.email,
      login: _oldProps.userInfo?.login,
      first_name: _oldProps.userInfo?.first_name,
      second_name: _oldProps.userInfo?.second_name,
      display_name: _oldProps.userInfo?.display_name,
      phone: _oldProps.userInfo?.phone,
    };

    const newUserInfo = {
      email: _newProps.userInfo?.email,
      login: _newProps.userInfo?.login,
      first_name: _newProps.userInfo?.first_name,
      second_name: _newProps.userInfo?.second_name,
      display_name: _newProps.userInfo?.display_name,
      phone: _newProps.userInfo?.phone,
    };
    if (!isEqual(oldUserInfo, newUserInfo)) {
      this.setProps({ formState: newUserInfo });
      return true;
    }

    return false;
  }

  render() {
    const errorMessage = this.props.error ? JSON.stringify(this.props.error) : "";
    const ControlsBlock = this.props.isEdit
      ? `
        <div class="user-profile__controls user-profile__controls--edit">
          {{{ SubmitButton }}}
        </div>
      `
      : `
        <div class="user-profile__controls">
          <div class="user-profile__line">
            {{{ EditProfileButton }}}
          </div>
          <div class="user-profile__line">
            {{{ EditPasswordButton }}}
          </div>
          <div class="user-profile__line button--exit">
            {{{ ExitButton }}}
          </div>
        </div>
      `;

    return `
      <div class="user-profile__back-button">
        {{{ BackButton }}}
      </div>
      <div class="user-profile__main">
        <form id="user-profile-form">

          <div class="user-profile__short-info">
            {{{ UserAvatarBtn }}}
            <p>{{user.display_name}}</p>
          </div>

          <div class="user-profile__detailed-info">
            <div class="user-profile__line">
              <span>Почта</span>
              {{{ InputEmail }}}
            </div>
            <div class="user-profile__line">
              <span>Логин</span>
              {{{ InputLogin }}}
            </div>
            <div class="user-profile__line">
              <span>Имя</span>
              {{{ InputFirstName }}}
            </div>
            <div class="user-profile__line">
              <span>Фамилия</span>
              {{{ InputSecondName }}}
            </div>
            <div class="user-profile__line">
              <span>Имя в чате</span>
              {{{ InputDisplayName }}}
            </div>
            <div class="user-profile__line">
              <span>Телефон</span>
              {{{ InputPhone }}}
            </div>
          </div>

          <div>${errorMessage}</div>

          ${ControlsBlock}
        </form>
      </div>

      {{{ ModalChangeAvatar }}}
    `;
  }
}

const ConnectedUserProfilePage = connect<TUserProfilePageProps>(UserProfilePage, (state) => ({
  error: state.error as IErrorResponse,
  userInfo: state.authUserInfo as IUser,
}));

export default ConnectedUserProfilePage;
