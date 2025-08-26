import { Avatar, Button, Input, Modal } from "../../components";
import Block, { type Props } from "../../core/Block";
import arrowIcon from "../../assets/arrow-icon.svg?raw";
import { validateInput } from "../../utils/validateForm";
import { INPUT_NAME } from "../../constants/INPUT_NAME";
import { userMockData } from "../../mockData";
import UserAvatarButton from "./userAvatarButton";

type TUserProfileFormData = {
  email: string;
  login: string;
  firstName: string;
  secondName: string;
  displayName: string;
  phone: string;
};
type TUserProfilePageProps = Props & {
  formState: TUserProfileFormData;
  errors: TUserProfileFormData;
  isEdit: boolean;
};

export default class UserProfilePage extends Block<TUserProfilePageProps> {
  static FIELDS = {
    [INPUT_NAME.EMAIL]: "InputEmail",
    [INPUT_NAME.LOGIN]: "InputLogin",
    [INPUT_NAME.FIRST_NAME]: "InputFirstName",
    [INPUT_NAME.SECOND_NAME]: "InputSecondName",
    [INPUT_NAME.DISPLAY_NAME]: "InputDisplayName",
    [INPUT_NAME.PHONE]: "InputPhone",
  };

  constructor() {
    const formState = {
      email: userMockData.email,
      login: userMockData.login,
      firstName: userMockData.first_name,
      secondName: userMockData.second_name,
      displayName: userMockData.display_name,
      phone: userMockData.phone,
    };
    const errors = {
      email: "",
      login: "",
      firstName: "",
      secondName: "",
      displayName: "",
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
      page: "chats",
      icon: arrowIcon,
      onClick: (e: Event) => {
        e.preventDefault();
        // eslint-disable-next-line no-console
        console.log("navigate to chats");
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
      page: "edit-password",
      type: "button",
      onClick: (e) => {
        e.preventDefault();
        // eslint-disable-next-line no-console
        console.log("navigate to edit password");
      },
    });
    const ExitButton = new Button({
      label: "Выйти",
      variant: "link",
      page: "login",
      type: "button",
      onClick: (e) => {
        e.preventDefault();
        // eslint-disable-next-line no-console
        console.log("navigate to login");
      },
    });
    const SubmitButton = new Button({
      label: "Сохранить",
      variant: "primary",
      type: "submit",
      onClick: (e) => {
        e.preventDefault();
        if (allValidateInput()) {
          // eslint-disable-next-line no-console
          console.log(this.props.formState);
          onChangeIsEdit(false);
        }
      },
    });
    const UserAvatar = new Avatar({
      width: "130px",
      height: "130px",
      avatarUrl: userMockData.avatarUrl,
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
      value: formState.firstName,
      errorMessage: errors.firstName,
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
      value: formState.secondName,
      errorMessage: errors.secondName,
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
      value: formState.displayName,
      errorMessage: errors.displayName,
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
        const form = document.getElementById("user-avatar-form") as HTMLFormElement;
        const formData = new FormData(form);
        // eslint-disable-next-line no-console
        console.log("upload avatar", formData.get("avatar"));
        if (!Array.isArray(this.children.ModalChangeAvatar)) {
          this.children.ModalChangeAvatar.setProps({ active: false });
        }
      },
    });
    const ModalChangeAvatar = new Modal({
      id: "change-avatar-modal",
      active: false,
      children: `
        <form id="user-avatar-form">
          <p class="modal__title">Загрузите файл</p>
          <label class="avatar-modal__file-label">
            <input type="file" name="avatar" accept="image/*" class="avatar-modal__file-input" />
            <span class="avatar-modal__file-text">Выбрать файл на компьютере</span>
          </label>
          {{{ SubmitAvatarButton }}}
        </form>
      `,
      SubmitAvatarButton,
    });

    super("div", {
      formState,
      errors,
      isEdit,
      user: userMockData,
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

  protected componentDidUpdate(
    _oldProps: TUserProfilePageProps,
    _newProps: TUserProfilePageProps,
  ): boolean {
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

    return false;
  }

  render() {
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
          ${ControlsBlock}
        </form>
      </div>

      {{{ ModalChangeAvatar }}}
    `;
  }
}
